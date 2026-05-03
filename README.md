# GatiSetu: Agentic Logistics Ecosystem 🚜🚛

**GatiSetu** is an intelligent, agentic logistics ecosystem designed to bridge the gap between Kisans (Farmers) and Sarathis (Drivers). By leveraging **Predictive Resource Pooling** and **Dead-Mile Reduction**, GatiSetu significantly lowers transportation costs for farmers while increasing profit margins for drivers.

This project was built to demonstrate "Possible & Scalable" industrial utility, focusing on Revenue Optimization and Logistics Infrastructure.

---

## 🌟 Core Innovations

### 1. Predictive Resource Pooling
- **Virtual Aggregation Hubs (Setu Points)**: Instead of trucks visiting multiple isolated farms, GatiSetu uses Haversine distance clustering to group farmers within a 10km radius to a single Setu Point (e.g., a local Panchayat Bhawan or Temple).
- **Carbon & Cost Savings**: By pooling loads, GatiSetu eliminates redundant travel, drastically reducing CO₂ emissions and splitting the optimized freight cost among participating farmers.

### 2. Dead-Mile Reduction (Backhaul Algorithm)
- **Monetizing Empty Returns**: Trucks returning empty from urban mandis are matched with farmers needing return goods (seeds, fertilizers, equipment).
- **60% Discounted Freight**: Farmers receive a 60% discount on standard freight rates for backhaul loads, while drivers earn extra revenue on trips that would otherwise consume fuel for zero profit.

### 3. Agentic LLM Integration
- **Dual-Pipeline Voice-to-Route**: A robust AI pipeline (OpenRouter primary + Gemini fallback) translates raw Hindi or English speech into structured JSON shipping orders.
- **AI Logic Explainer**: Generates human-readable, judge-friendly justifications for pooled routes (e.g., "Grouped 3 farmers to save 22% fuel and increase profit by ₹800"), output in both English and Hindi.
- **AarogyaVani-style TTS Engine**: Parses and reads back orders and explanations dynamically using the native Web Speech API (`window.speechSynthesis`), equipped with intelligent fallback chains.

---

## 🛠️ Industrial Utility UI (The "Blueprint" Aesthetic)

GatiSetu discards soft "AI-made" aesthetics in favor of a rugged, high-contrast, professional design:
- **Deep Slate & Action Orange**: A strict color system (`#0F172A` and `#F97316`) engineered for high visibility and industrial context.
- **Sharp Edges**: Zero border-radius elements, 1px slate borders, and structural grid layouts.
- **Dual-Dashboard Architecture**:
  - **Kisan View**: Focused on Earnings, active Pooling Status, and Backhaul Opportunities.
  - **Sarathi View**: Focused on Route Efficiency, Fuel Savings, and Dead-Mile pickups.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+

### 1. Backend Setup (FastAPI Engine)
The Python backend contains the Pooling Engine, Backhaul Algorithm, and LLM Router.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up API Keys
cp .env.example .env
# Edit .env and add your OpenRouter and/or Gemini API keys

# Run the backend server
uvicorn main:app --reload
```
*The backend runs on `http://localhost:8000` and automatically feeds demo data if API keys are missing.*

### 2. Frontend Setup (React + Vite)
The frontend uses Tailwind CSS v4 and proxies requests to the local backend.

```bash
# From the project root
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`. Open this in your browser.*

---

## 📊 The "Jio Proof" Benchmark
GatiSetu includes a dedicated benchmark page comparing its metrics directly against traditional middlemen using animated Recharts. It highlights:
- **Cost Reduction**: ~58% cheaper for farmers.
- **Driver Profit**: ~59% increase in earnings.
- **CO₂ Reduction**: ~62% drop in emissions per trip.

---

## 🔐 QR Trust Protocol
To ensure real-world security and accountability, GatiSetu implements a dynamic QR protocol:
1. Kisans receive a generated QR code upon successful pooling.
2. Sarathis use the built-in scanner to "check-in" at Setu Points, verifying the pickup and building their platform trust score.

---
*Built for the Hackathon — Team Zenith*
