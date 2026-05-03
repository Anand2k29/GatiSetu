"""
GatiSetu — FastAPI Backend
Agentic Logistics Ecosystem: Pooling Engine + Backhaul Algorithm + LLM Integration
"""
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend dir to path so engine/models can be imported
sys.path.insert(0, str(Path(__file__).parent))

from routers import pool, backhaul, llm

app = FastAPI(
    title="GatiSetu API",
    description="Predictive Resource Pooling & Dead-Mile Reduction for Indian Agriculture Logistics",
    version="1.0.0"
)

# CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(pool.router)
app.include_router(backhaul.router)
app.include_router(llm.router)


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "GatiSetu Backend",
        "version": "1.0.0",
        "engines": ["pooling", "backhaul", "voice-route", "explainer"]
    }
