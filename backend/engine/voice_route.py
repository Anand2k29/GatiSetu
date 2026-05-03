"""
GatiSetu — Voice-to-Route Engine
Takes raw natural language (Hindi/English) and converts to a JSON shipping order.
"""
import json, re
from models import VoiceRouteRequest, ShippingOrder, VoiceRouteResponse
from engine.llm_router import call_llm

SYSTEM_PROMPT = """You are a logistics assistant for Indian farmers. Convert the natural language shipping request into JSON.
Extract: farmer_name, crop_type, weight_kg, source_village, destination_mandi, urgency (low/medium/high).
Output ONLY valid JSON. No markdown. If a field is not mentioned, use null."""


async def parse_voice_to_route(request: VoiceRouteRequest) -> VoiceRouteResponse:
    lang_label = "Hindi" if request.language == "hi" else "English"
    prompt = f'Language: {lang_label}\nUser said: "{request.text}"\nConvert to JSON:'
    response_text, provider = await call_llm(prompt, SYSTEM_PROMPT)

    if response_text and provider != "mock":
        order = _parse_llm_response(response_text, request.text)
    else:
        order = _regex_extract(request.text)
        provider = "regex-fallback"

    return VoiceRouteResponse(
        order=order,
        confirmation_text_en=_confirm_en(order),
        confirmation_text_hi=_confirm_hi(order),
        provider=provider
    )


def _parse_llm_response(text: str, raw_input: str) -> ShippingOrder:
    clean = text.strip()
    for prefix in ["```json", "```"]:
        if clean.startswith(prefix): clean = clean[len(prefix):]
    if clean.endswith("```"): clean = clean[:-3]
    clean = clean.strip()
    if not clean.startswith("{"):
        s, e = clean.find("{"), clean.rfind("}")
        if s != -1 and e != -1: clean = clean[s:e+1]
    try:
        d = json.loads(clean)
        return ShippingOrder(farmer_name=d.get("farmer_name"), crop_type=d.get("crop_type"),
            weight_kg=d.get("weight_kg"), source_village=d.get("source_village"),
            destination_mandi=d.get("destination_mandi"), urgency=d.get("urgency","medium"),
            raw_input=raw_input, confidence=0.85)
    except Exception:
        return _regex_extract(raw_input)


def _regex_extract(text: str) -> ShippingOrder:
    t = text.lower()
    w = None
    m = re.search(r'(\d+)\s*(kg|kilo|किलो)', t)
    if m: w = float(m.group(1))
    crops = {'wheat':'Wheat','gehun':'Wheat','गेहूं':'Wheat','rice':'Rice','chawal':'Rice','चावल':'Rice',
        'tomato':'Tomato','tamatar':'Tomato','टमाटर':'Tomato','potato':'Potato','aloo':'Potato','आलू':'Potato',
        'onion':'Onion','pyaz':'Onion','प्याज':'Onion','mustard':'Mustard','sarson':'Mustard','सरसों':'Mustard',
        'sugarcane':'Sugarcane','ganna':'Sugarcane','गन्ना':'Sugarcane'}
    crop = next((v for k,v in crops.items() if k in t), None)
    mandis = {'azadpur':'Azadpur Mandi','आज़ादपुर':'Azadpur Mandi','ghazipur':'Ghazipur Mandi',
        'okhla':'Okhla Mandi','keshopur':'Keshopur Mandi'}
    mandi = next((v for k,v in mandis.items() if k in t), None)
    return ShippingOrder(crop_type=crop, weight_kg=w, destination_mandi=mandi, raw_input=text, confidence=0.4)


def _confirm_en(o: ShippingOrder) -> str:
    p = ["Your order:"]
    if o.crop_type: p.append(f"Crop: {o.crop_type}.")
    if o.weight_kg: p.append(f"Weight: {int(o.weight_kg)} kg.")
    if o.destination_mandi: p.append(f"To: {o.destination_mandi}.")
    p.append("Please confirm.")
    return " ".join(p)


def _confirm_hi(o: ShippingOrder) -> str:
    hi = {'Wheat':'गेहूं','Rice':'चावल','Tomato':'टमाटर','Potato':'आलू','Onion':'प्याज','Mustard':'सरसों','Sugarcane':'गन्ना'}
    p = ["आपका ऑर्डर:"]
    if o.crop_type: p.append(f"फसल: {hi.get(o.crop_type, o.crop_type)}।")
    if o.weight_kg: p.append(f"वजन: {int(o.weight_kg)} किलो।")
    if o.destination_mandi: p.append(f"मंडी: {o.destination_mandi}।")
    p.append("कृपया पुष्टि करें।")
    return " ".join(p)
