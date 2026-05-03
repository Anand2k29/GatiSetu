"""GatiSetu — Backhaul Router"""
from fastapi import APIRouter
from models import BackhaulRequest, BackhaulResult, BackhaulItem, Truck
from engine.backhaul import match_backhaul, get_demo_backhaul, load_demo_trucks, get_available_items

router = APIRouter(prefix="/api/backhaul", tags=["Backhaul Algorithm"])


@router.post("/match", response_model=BackhaulResult)
async def match(request: BackhaulRequest):
    """Match farmer return needs to empty returning trucks."""
    return match_backhaul(request)


@router.get("/trucks", response_model=list[Truck])
async def trucks():
    """Get all returning trucks with available capacity."""
    return load_demo_trucks()


@router.get("/items", response_model=list[BackhaulItem])
async def items():
    """Get commonly available backhaul items."""
    return get_available_items()


@router.get("/demo", response_model=BackhaulResult)
async def demo():
    """Pre-computed demo backhaul scenario."""
    return get_demo_backhaul()
