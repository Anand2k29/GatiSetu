"""
GatiSetu — Pooling Engine
Groups multiple farmers within a 10km radius of Setu Points into single Sarathi routes.
Uses Haversine distance for geographic clustering.
"""

import json
import os
from pathlib import Path
from haversine import haversine, Unit
from models import (
    Farmer, SetuPoint, Location,
    PoolingRequest, PoolingResult, PooledGroup
)

DATA_DIR = Path(__file__).parent.parent / "data"


def load_setu_points() -> list[SetuPoint]:
    """Load pre-defined Setu Points from JSON."""
    with open(DATA_DIR / "setu_points.json", "r") as f:
        raw = json.load(f)
    return [SetuPoint(**sp) for sp in raw]


def load_demo_farmers() -> list[Farmer]:
    """Load demo farmer data from JSON."""
    with open(DATA_DIR / "demo_farmers.json", "r") as f:
        raw = json.load(f)
    return [Farmer(**f) for f in raw]


def _haversine_km(loc1: Location, loc2: Location) -> float:
    """Calculate distance in km between two locations."""
    return haversine(
        (loc1.lat, loc1.lng),
        (loc2.lat, loc2.lng),
        unit=Unit.KILOMETERS
    )


def _estimate_individual_distance(farmers: list[Farmer], mandi_lat: float, mandi_lng: float) -> float:
    """Sum of individual distances if each farmer drove separately to the mandi."""
    mandi_loc = Location(lat=mandi_lat, lng=mandi_lng)
    return sum(_haversine_km(f.location, mandi_loc) for f in farmers)


# Approx mandi coordinates for distance calculations
MANDI_COORDS = {
    "Azadpur Mandi": Location(lat=28.7168, lng=77.1528),
    "Ghazipur Mandi": Location(lat=28.6250, lng=77.3210),
    "Okhla Mandi": Location(lat=28.5500, lng=77.2800),
    "Keshopur Mandi": Location(lat=28.6800, lng=77.0900),
}

# CO2 emission factor: kg CO2 per km for a medium truck
CO2_PER_KM = 0.21
# Average rate per km in INR
RATE_PER_KM = 18


def compute_pooling(request: PoolingRequest) -> PoolingResult:
    """
    Core pooling algorithm:
    1. For each Setu Point, find all farmers within radius_km
    2. Group them by destination mandi
    3. Calculate optimized vs individual metrics
    """
    setu_points = load_setu_points()
    farmers = request.farmers
    radius = request.radius_km

    # Track which farmers have been assigned
    assigned = set()
    groups: list[PooledGroup] = []

    for sp in setu_points:
        # Find farmers near this Setu Point
        nearby_farmers = []
        for f in farmers:
            if f.id in assigned:
                continue
            dist = _haversine_km(f.location, sp.location)
            if dist <= radius:
                nearby_farmers.append(f)

        if not nearby_farmers:
            continue

        # Group by destination mandi
        mandi_groups: dict[str, list[Farmer]] = {}
        for f in nearby_farmers:
            dest = f.destination_mandi
            if dest not in mandi_groups:
                mandi_groups[dest] = []
            mandi_groups[dest].append(f)

        for mandi, mandi_farmers in mandi_groups.items():
            if len(mandi_farmers) < 1:
                continue

            # Mark as assigned
            for f in mandi_farmers:
                assigned.add(f.id)

            total_weight = sum(f.weight_kg for f in mandi_farmers)
            mandi_loc = MANDI_COORDS.get(mandi, Location(lat=28.65, lng=77.20))

            # Individual distances (if each farmer went alone)
            individual_total = _estimate_individual_distance(mandi_farmers, mandi_loc.lat, mandi_loc.lng)

            # Optimized: Setu Point to Mandi (single trip)
            optimized_dist = _haversine_km(sp.location, mandi_loc)

            # Metrics
            distance_saved = individual_total - optimized_dist
            carbon_saved = distance_saved * CO2_PER_KM
            profit_increase = distance_saved * RATE_PER_KM * 0.4  # 40% of savings goes to driver

            groups.append(PooledGroup(
                setu_point=sp,
                farmers=mandi_farmers,
                total_weight_kg=total_weight,
                total_distance_km=round(individual_total, 1),
                optimized_distance_km=round(optimized_dist, 1),
                carbon_saved_kg=round(carbon_saved, 2),
                profit_increase_inr=round(profit_increase, 0),
                farmer_count=len(mandi_farmers)
            ))

    # Summary
    total_carbon = sum(g.carbon_saved_kg for g in groups)
    total_profit = sum(g.profit_increase_inr for g in groups)
    total_dist_saved = sum(g.total_distance_km - g.optimized_distance_km for g in groups)
    total_original = sum(g.total_distance_km for g in groups)
    efficiency = (total_dist_saved / total_original * 100) if total_original > 0 else 0

    return PoolingResult(
        groups=groups,
        total_farmers_pooled=len(assigned),
        total_carbon_saved_kg=round(total_carbon, 2),
        total_profit_increase_inr=round(total_profit, 0),
        total_distance_saved_km=round(total_dist_saved, 1),
        efficiency_pct=round(efficiency, 1)
    )


def get_demo_pooling() -> PoolingResult:
    """Pre-computed demo scenario with all sample farmers."""
    demo_farmers = load_demo_farmers()
    request = PoolingRequest(farmers=demo_farmers, radius_km=10.0)
    return compute_pooling(request)
