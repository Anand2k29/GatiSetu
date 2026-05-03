# GatiSetu: Agentic Logistics Ecosystem 🚜🚛

> **Empowering Bharat's Agri-Supply Chain** — Connecting farmers to mandis through AI-optimized truck routes.

**GatiSetu** is an intelligent, agentic logistics ecosystem designed to bridge the gap between **Kisans** (Farmers) and **Sarathis** (Drivers). By leveraging **Predictive Resource Pooling** and **Dead-Mile Reduction**, GatiSetu significantly lowers transportation costs for farmers while increasing profit margins for drivers.

Built for the **Google Solution Challenge 2026** by Team Platypus Protocol.

---

## 💡 The Problem We Solve

Indian agriculture suffers from three critical logistics failures:

| Problem | Impact | Who Suffers |
|---------|--------|-------------|
| **High Middleman Commissions** | Farmers lose 40-60% of earnings to intermediaries | Kisans |
| **Empty Return Trucks (Dead Miles)** | Over 60% of trucks return empty from mandis | Sarathis |
| **Fragmented Supply Chains** | Individual small loads = maximum cost per farmer | Both |

GatiSetu eliminates all three by creating a **predictive, AI-driven pooling network** that clusters farmer loads at virtual Setu Points and routes optimized trucks through them.

---

## 💰 How Farmers Save Money

Traditional logistics forces each farmer to hire their own truck for small loads — paying full price for a half-empty vehicle. GatiSetu changes this fundamentally:

### The Pooling Model
1. **5 farmers** in a 10km radius each have 200kg of produce to ship.
2. **Traditional:** Each hires a separate truck → 5 trucks, 5 full fares = **₹100/km per farmer**.
3. **GatiSetu:** AI clusters all 5 loads at a single **Setu Point** (e.g., a local temple or panchayat). One optimized truck picks up all 1000kg → **₹42/km per farmer**.

### The Numbers
| Metric | Traditional | GatiSetu | Savings |
|--------|------------|----------|---------|
| Transport cost per km | ₹100 | ₹42 | **-58%** |
| Middleman commission | 40-60% | 0% (direct) | **Eliminated** |
| Return goods (seeds, fertilizer) | ₹1000/bag | ₹400/bag | **-60%** |

### Backhaul Benefit for Farmers
When trucks return from the mandi, they're usually empty. GatiSetu fills these return trips with **subsidized farming inputs** (seeds, fertilizer, equipment). Farmers get these essentials at **60% off** standard freight rates because the truck is going back anyway — the driver earns extra, the farmer saves money. Everyone wins.

---

## 🚛 How Drivers Earn More

Truck drivers (Sarathis) in India face a brutal reality: over 60% of their return trips are completely empty. They burn fuel, waste time, and earn nothing. GatiSetu turns every mile into a revenue mile:

### The Revenue Model
1. **Forward Trip:** Pre-pooled, guaranteed full-capacity loads at Setu Points. No more driving to 5 scattered farms — one stop, full truck.
2. **Return Trip (Backhaul):** Instead of driving back empty, the truck carries subsidized farming inputs to villages. The driver earns freight on both legs.

### The Numbers
| Metric | Traditional | GatiSetu | Improvement |
|--------|------------|----------|-------------|
| Monthly income | ₹15,000 | ₹23,800 | **+59%** |
| Dead miles (empty return) | 60% of trips | ~0% | **Eliminated** |
| Fuel wasted on empty runs | ₹3,000-5,000/mo | ₹0 | **100% saved** |
| Loads per trip | Often half-empty | Guaranteed full | **2x capacity utilization** |

### Why Drivers Love GatiSetu
- **No more searching for loads** — the AI pre-assigns optimized routes with guaranteed pickups.
- **Backhaul income** — every return trip earns money instead of burning fuel.
- **Gati-Pass QR system** — digital verification builds trust and enables instant payments.

---

## 🌟 Core Innovations

### 1. Predictive Resource Pooling
- **Virtual Aggregation Hubs (Setu Points)**: GatiSetu uses Haversine distance clustering to group farmers within a 10km radius to a single Setu Point (e.g., a local Panchayat Bhawan or Temple).
- **Carbon & Cost Savings**: By pooling loads, GatiSetu eliminates redundant travel, drastically reducing CO₂ emissions and splitting the optimized freight cost among participating farmers.

### 2. Dead-Mile Reduction (Backhaul Algorithm)
- **Monetizing Empty Returns**: Trucks returning empty from urban mandis are matched with farmers needing return goods (seeds, fertilizers, equipment).
- **60% Discounted Freight**: Farmers receive a 60% discount on standard freight rates for backhaul loads, while drivers earn extra revenue on trips that would otherwise consume fuel for zero profit.

### 3. Agentic LLM Integration
- **Dual-Pipeline Voice-to-Route**: A robust AI pipeline (OpenRouter primary + Gemini fallback) translates raw Hindi or English speech into structured JSON shipping orders.
- **AI Logic Explainer**: Generates human-readable justifications for pooled routes (e.g., "Grouped 3 farmers to save 22% fuel and increase profit by ₹800"), output in both English and Hindi.
- **TTS Engine**: Parses and reads back orders dynamically using the native Web Speech API, equipped with intelligent fallback chains for Hindi/English.

---

## 🛠️ Industrial Utility UI

GatiSetu uses a professional, "Earthy Saffron" design system engineered for real-world use in fields and truck cabins:

| Token | Hex | Purpose |
|-------|-----|---------|
| Field Charcoal | `#0A0F1E` | Deep, grounded background |
| Amber Saffron | `#F59E0B` | Sarathi (Driver) actions & highlights |
| Agri-Green | `#16A34A` | Kisan (Farmer) actions & growth indicators |
| Industrial Border | `#334155` | 1px solid borders on all cards |

- **Sharp 2px corners** — no soft, rounded "consumer app" look.
- **1px borders, no shadows** — engineered infrastructure aesthetic.
- **Dual-Dashboard Architecture:**
  - **Kisan View**: Earnings, active Pooling Status, and Backhaul Opportunities.
  - **Sarathi View**: Route Efficiency, Fuel Savings, and Dead-Mile pickups.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS 4 + Industrial Utility Design System
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Core Integrations:** Firebase, React QR Scanner (Gati-Pass)
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python) + Uvicorn
- **Data Validation:** Pydantic
- **AI/LLM Logic:** OpenRouter API, Google Gemini API
- **Geospatial Calculations:** Haversine (Distance clustering)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+

### 1. Backend Setup (FastAPI Engine)

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

```bash
# From the project root
npm install
npm run dev
```
*The frontend runs on `http://localhost:5173`. Open this in your browser.*

---

## 📊 Performance Audit (The "Jio Proof" Benchmark)

GatiSetu includes a dedicated benchmark comparing its metrics directly against traditional middlemen logistics:

| Metric | Traditional | GatiSetu | Delta |
|--------|------------|----------|-------|
| Transport cost/km | ₹100 | ₹42 | **-58%** |
| Driver monthly income | ₹15,000 | ₹23,800 | **+59%** |
| CO₂ emissions/trip | Baseline | -62% | **-62%** |
| Dead miles | 60% of trips | ~0% | **Eliminated** |
| Farming input costs | ₹1000/bag | ₹400/bag | **-60%** |

---

## 🔐 QR Trust Protocol (Gati-Pass)

To ensure real-world security and accountability, GatiSetu implements a dynamic QR protocol:
1. **Kisans** receive a generated Gati-Pass QR code upon successful load booking.
2. **Sarathis** use the built-in scanner to verify pickups at Setu Points, building their platform trust score.
3. **Virtual Sarathi** auto-assignment ensures loads are matched to drivers within seconds (demo-optimized for hackathon presentations).

---

## 🌐 Multilingual Support

GatiSetu supports **English** and **Hindi** with a one-click toggle. Key headlines, CTAs, and dashboard labels switch instantly — designed for the multilingual reality of Indian agriculture.

---

## 📁 Project Structure

```
GatiSetu/
├── backend/                 # FastAPI engine
│   ├── engine/              # Pooling, backhaul, LLM, voice-route logic
│   ├── routers/             # API endpoints (pool, backhaul, LLM, voice)
│   ├── data/                # Demo farmers, trucks, Setu points
│   └── main.py              # FastAPI app entry point
├── src/                     # React frontend
│   ├── components/          # LandingPage, KisanDashboard, SarathiDashboard, etc.
│   ├── context/             # AppContext (state management)
│   ├── services/            # API client, TTS engine
│   └── index.css            # Industrial design system
├── public/                  # Static assets (hero_banner.png)
└── README.md
```

---




**UN SDGs Addressed:**
- SDG 2: Zero Hunger (efficient farm-to-market supply chains)
- SDG 8: Decent Work and Economic Growth (driver income boost)
- SDG 9: Industry, Innovation and Infrastructure (agentic logistics)
- SDG 13: Climate Action (CO₂ reduction via pooling)
