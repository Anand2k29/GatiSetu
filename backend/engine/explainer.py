"""
GatiSetu — AI Explainer Engine
Generates human-readable explanations of pooling results for judges.
"""
from models import PoolingResult, ExplainRequest, ExplainResponse
from engine.llm_router import call_llm

SYSTEM_PROMPT = """You are the AI brain of GatiSetu logistics platform. Given pooling metrics, generate a concise, impressive explanation for hackathon judges. Be specific with numbers. Keep it under 3 sentences. Output a JSON with "explanation_en" (English) and "explanation_hi" (Hindi). No markdown."""


async def generate_explanation(pooling_result: PoolingResult) -> ExplainResponse:
    metrics = {
        "farmers_pooled": pooling_result.total_farmers_pooled,
        "groups_formed": len(pooling_result.groups),
        "carbon_saved_kg": pooling_result.total_carbon_saved_kg,
        "profit_increase_inr": pooling_result.total_profit_increase_inr,
        "distance_saved_km": pooling_result.total_distance_saved_km,
        "efficiency_pct": pooling_result.efficiency_pct,
    }

    prompt = f"Pooling metrics: {metrics}\nGenerate explanation JSON."
    response_text, provider = await call_llm(prompt, SYSTEM_PROMPT)

    if response_text and provider != "mock":
        try:
            import json
            clean = response_text.strip()
            for p in ["```json", "```"]:
                if clean.startswith(p): clean = clean[len(p):]
            if clean.endswith("```"): clean = clean[:-3]
            if not clean.startswith("{"): 
                s,e = clean.find("{"), clean.rfind("}")
                if s!=-1 and e!=-1: clean = clean[s:e+1]
            data = json.loads(clean.strip())
            return ExplainResponse(
                explanation_en=data.get("explanation_en", _mock_en(metrics)),
                explanation_hi=data.get("explanation_hi", _mock_hi(metrics)),
                metrics=metrics, provider=provider
            )
        except Exception:
            pass

    return ExplainResponse(
        explanation_en=_mock_en(metrics),
        explanation_hi=_mock_hi(metrics),
        metrics=metrics, provider="mock"
    )


def _mock_en(m: dict) -> str:
    return (f"I pooled {m['farmers_pooled']} farmers into {m['groups_formed']} optimized routes, "
            f"reducing total carbon footprint by {m['carbon_saved_kg']:.1f} kg CO2 "
            f"and increasing driver profit by ₹{m['profit_increase_inr']:.0f}. "
            f"This saved {m['distance_saved_km']:.0f} km of redundant travel, "
            f"achieving {m['efficiency_pct']:.0f}% route efficiency.")


def _mock_hi(m: dict) -> str:
    return (f"मैंने {m['farmers_pooled']} किसानों को {m['groups_formed']} अनुकूलित मार्गों में जोड़ा, "
            f"जिससे कुल कार्बन फुटप्रिंट {m['carbon_saved_kg']:.1f} किलो CO2 कम हुआ "
            f"और सारथी का लाभ ₹{m['profit_increase_inr']:.0f} बढ़ा। "
            f"इससे {m['distance_saved_km']:.0f} किमी की अनावश्यक यात्रा बची, "
            f"{m['efficiency_pct']:.0f}% मार्ग दक्षता प्राप्त हुई।")
