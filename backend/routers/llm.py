"""GatiSetu — LLM Router (Voice-to-Route + AI Explainer)"""
from fastapi import APIRouter
from models import VoiceRouteRequest, VoiceRouteResponse, ExplainRequest, ExplainResponse
from engine.voice_route import parse_voice_to_route
from engine.explainer import generate_explanation

router = APIRouter(prefix="/api", tags=["LLM Integration"])


@router.post("/voice-route", response_model=VoiceRouteResponse)
async def voice_route(request: VoiceRouteRequest):
    """Convert natural language (Hindi/English) to a JSON shipping order."""
    return await parse_voice_to_route(request)


@router.post("/explain", response_model=ExplainResponse)
async def explain(request: ExplainRequest):
    """Generate AI explanation for a pooling result."""
    return await generate_explanation(request.pooling_result)
