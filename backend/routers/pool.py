"""GatiSetu — Pooling Router"""
from fastapi import APIRouter
from models import PoolingRequest, PoolingResult, SetuPoint
from engine.pooling import compute_pooling, get_demo_pooling, load_setu_points

router = APIRouter(prefix="/api/pool", tags=["Pooling Engine"])


@router.post("/compute", response_model=PoolingResult)
async def compute(request: PoolingRequest):
    """Run the pooling engine on provided farmers."""
    return compute_pooling(request)


@router.get("/setu-points", response_model=list[SetuPoint])
async def setu_points():
    """Get all virtual aggregation hub locations."""
    return load_setu_points()


@router.get("/demo", response_model=PoolingResult)
async def demo():
    """Pre-computed demo scenario with sample farmers for judges."""
    return get_demo_pooling()
