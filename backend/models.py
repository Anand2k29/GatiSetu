"""
GatiSetu — Pydantic Models
All data shapes for the Pooling Engine, Backhaul Algorithm, and LLM integration.
"""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


# ─── Enums ──────────────────────────────────────────────────────────

class Language(str, Enum):
    ENGLISH = "en"
    HINDI = "hi"


class Urgency(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ─── Core Entities ──────────────────────────────────────────────────

class Location(BaseModel):
    lat: float
    lng: float


class Farmer(BaseModel):
    id: str
    name: str
    village: str
    location: Location
    crop: str
    weight_kg: float
    destination_mandi: str
    phone: Optional[str] = None


class SetuPoint(BaseModel):
    id: str
    name: str
    location: Location
    village_cluster: list[str]
    landmark_type: str = "Panchayat Bhawan"
    capacity_kg: float = 5000.0


class Truck(BaseModel):
    id: str
    driver_name: str
    vehicle_number: str
    return_route_from: str
    return_route_to: str
    location: Location
    available_capacity_kg: float
    eta_hours: float
    status: str = "returning"


# ─── Pooling Engine ────────────────────────────────────────────────

class PoolingRequest(BaseModel):
    farmers: list[Farmer]
    radius_km: float = 10.0
    destination_mandi: Optional[str] = None


class PooledGroup(BaseModel):
    setu_point: SetuPoint
    farmers: list[Farmer]
    total_weight_kg: float
    total_distance_km: float
    optimized_distance_km: float
    carbon_saved_kg: float
    profit_increase_inr: float
    farmer_count: int


class PoolingResult(BaseModel):
    groups: list[PooledGroup]
    total_farmers_pooled: int
    total_carbon_saved_kg: float
    total_profit_increase_inr: float
    total_distance_saved_km: float
    efficiency_pct: float


# ─── Backhaul Algorithm ────────────────────────────────────────────

class BackhaulItem(BaseModel):
    item_name: str
    weight_kg: float
    category: str = "agricultural_input"  # seeds, fertilizer, equipment


class BackhaulRequest(BaseModel):
    farmer_id: str
    farmer_location: Location
    items_needed: list[BackhaulItem]
    preferred_mandi: Optional[str] = None


class BackhaulOffer(BaseModel):
    truck: Truck
    items_matched: list[BackhaulItem]
    standard_price_inr: float
    discounted_price_inr: float
    discount_pct: float = 60.0
    savings_inr: float
    fuel_saved_liters: float
    dead_miles_reduced_km: float


class BackhaulResult(BaseModel):
    offers: list[BackhaulOffer]
    total_savings_inr: float
    total_dead_miles_reduced_km: float


# ─── Voice-to-Route (LLM) ─────────────────────────────────────────

class VoiceRouteRequest(BaseModel):
    text: str
    language: Language = Language.HINDI


class ShippingOrder(BaseModel):
    farmer_name: Optional[str] = None
    crop_type: Optional[str] = None
    weight_kg: Optional[float] = None
    source_village: Optional[str] = None
    destination_mandi: Optional[str] = None
    urgency: Urgency = Urgency.MEDIUM
    raw_input: str = ""
    confidence: float = 0.0


class VoiceRouteResponse(BaseModel):
    order: ShippingOrder
    confirmation_text_en: str
    confirmation_text_hi: str
    provider: str = "mock"


# ─── AI Explainer ──────────────────────────────────────────────────

class ExplainRequest(BaseModel):
    pooling_result: PoolingResult


class ExplainResponse(BaseModel):
    explanation_en: str
    explanation_hi: str
    metrics: dict
    provider: str = "mock"
