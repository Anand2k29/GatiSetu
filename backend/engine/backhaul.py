"""
GatiSetu — Backhaul Algorithm
Identifies empty trucks returning from urban mandis and offers spots
to farmers for returning goods (seeds, fertilizers) at 60% discount.
"""

import json
from pathlib import Path
from haversine import haversine, Unit
from models import (
    Truck, Location, BackhaulRequest, BackhaulItem,
    BackhaulOffer, BackhaulResult
)

DATA_DIR = Path(__file__).parent.parent / "data"

# Constants
STANDARD_RATE_PER_KM_PER_KG = 0.08  # INR per km per kg
BACKHAUL_DISCOUNT = 0.60  # 60% discount
FUEL_CONSUMPTION_PER_KM = 0.35  # liters per km for empty truck
DIESEL_PRICE = 92.0  # INR per liter


def load_demo_trucks() -> list[Truck]:
    """Load demo returning trucks from JSON."""
    with open(DATA_DIR / "demo_trucks.json", "r") as f:
        raw = json.load(f)
    return [Truck(**t) for t in raw]


def _haversine_km(loc1: Location, loc2: Location) -> float:
    return haversine(
        (loc1.lat, loc1.lng),
        (loc2.lat, loc2.lng),
        unit=Unit.KILOMETERS
    )


# Common return goods that farmers might need
SAMPLE_BACKHAUL_ITEMS = [
    BackhaulItem(item_name="DAP Fertilizer (50kg bags)", weight_kg=200, category="fertilizer"),
    BackhaulItem(item_name="Wheat Seeds (HD-2967)", weight_kg=100, category="seeds"),
    BackhaulItem(item_name="Drip Irrigation Kit", weight_kg=50, category="equipment"),
    BackhaulItem(item_name="Urea Fertilizer (45kg bags)", weight_kg=180, category="fertilizer"),
    BackhaulItem(item_name="Mustard Seeds (Pusa Bold)", weight_kg=80, category="seeds"),
    BackhaulItem(item_name="Spray Pump Set", weight_kg=30, category="equipment"),
    BackhaulItem(item_name="NPK Mix Fertilizer", weight_kg=150, category="fertilizer"),
    BackhaulItem(item_name="Paddy Seeds (Pusa-44)", weight_kg=120, category="seeds"),
]


def match_backhaul(request: BackhaulRequest) -> BackhaulResult:
    """
    Match a farmer's return goods needs to available returning trucks.
    Applies 60% discount on standard freight rates.
    """
    trucks = load_demo_trucks()
    offers: list[BackhaulOffer] = []

    total_items_weight = sum(item.weight_kg for item in request.items_needed)

    for truck in trucks:
        if truck.status != "returning":
            continue
        if truck.available_capacity_kg < total_items_weight:
            continue

        # Calculate distance from truck's return destination to farmer
        distance = _haversine_km(
            truck.location,
            request.farmer_location
        )

        # Only match if truck passes within 30km of farmer
        if distance > 30:
            continue

        # Pricing
        standard_price = total_items_weight * STANDARD_RATE_PER_KM_PER_KG * distance
        discounted_price = standard_price * (1 - BACKHAUL_DISCOUNT)
        savings = standard_price - discounted_price

        # Fuel savings (truck was going empty anyway, now it's utilized)
        fuel_saved = distance * FUEL_CONSUMPTION_PER_KM * 0.3  # 30% fuel efficiency gain with load
        dead_miles_reduced = distance * 0.8  # 80% of return trip is now utilized

        offers.append(BackhaulOffer(
            truck=truck,
            items_matched=request.items_needed,
            standard_price_inr=round(standard_price, 0),
            discounted_price_inr=round(discounted_price, 0),
            discount_pct=BACKHAUL_DISCOUNT * 100,
            savings_inr=round(savings, 0),
            fuel_saved_liters=round(fuel_saved, 2),
            dead_miles_reduced_km=round(dead_miles_reduced, 1)
        ))

    # Sort by cheapest first
    offers.sort(key=lambda o: o.discounted_price_inr)

    return BackhaulResult(
        offers=offers,
        total_savings_inr=round(sum(o.savings_inr for o in offers), 0),
        total_dead_miles_reduced_km=round(sum(o.dead_miles_reduced_km for o in offers), 1)
    )


def get_demo_backhaul() -> BackhaulResult:
    """Pre-computed demo backhaul scenario."""
    request = BackhaulRequest(
        farmer_id="f-01",
        farmer_location=Location(lat=28.8120, lng=79.0230),
        items_needed=[
            BackhaulItem(item_name="DAP Fertilizer (50kg bags)", weight_kg=200, category="fertilizer"),
            BackhaulItem(item_name="Wheat Seeds (HD-2967)", weight_kg=100, category="seeds"),
        ],
        preferred_mandi="Azadpur Mandi"
    )
    return match_backhaul(request)


def get_available_items() -> list[BackhaulItem]:
    """Return list of commonly available backhaul items."""
    return SAMPLE_BACKHAUL_ITEMS
