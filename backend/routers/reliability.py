"""
GatiSetu — Driver Reliability & Cancellation Risk Router
Endpoints for Sarathi cancellation probability, dataset benchmarks, and risk predictions.
"""

from fastapi import APIRouter, HTTPException
from engine.cancellation_risk import load_dataset_analytics, predict_cancellation_risk
from models import CancellationPredictionRequest, CancellationPredictionResponse

router = APIRouter(prefix="/api/reliability", tags=["Reliability & Risk Engine"])


@router.get("/stats")
async def get_dataset_stats():
    """
    Returns analytics and benchmark metrics computed from the
    150,000 record Industrial Driver Reliability & Cancellation dataset.
    """
    analytics = load_dataset_analytics()
    if analytics.get("status") == "error":
        raise HTTPException(status_code=500, detail=analytics.get("message"))
    return analytics


@router.post("/predict", response_model=CancellationPredictionResponse)
async def predict_risk(req: CancellationPredictionRequest):
    """
    Predict driver cancellation risk and reliability tier for a given trip configuration.
    """
    result = predict_cancellation_risk(
        vehicle_type=req.vehicle_type,
        distance_km=req.distance_km,
        vtat_mins=req.vtat_mins
    )
    return CancellationPredictionResponse(**result)


@router.get("/reasons")
async def get_cancel_reasons():
    """
    Returns the distribution of driver cancellation triggers.
    """
    stats = load_dataset_analytics()
    return {
        "cancel_reasons": stats.get("cancel_reasons", {}),
        "total_records": stats.get("total_records", 0)
    }
