/**
 * GatiSetu — API Client
 * Centralized API calls to the FastAPI backend.
 * Falls back to mock data if backend is unavailable.
 */

const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[GatiSetu API] ${url} failed:`, err.message);
    return null;
  }
}

// ─── Pooling Engine ───
export async function getDemoPooling() {
  return await fetchJSON('/pool/demo');
}

export async function computePooling(farmers, radiusKm = 10) {
  return await fetchJSON('/pool/compute', {
    method: 'POST',
    body: JSON.stringify({ farmers, radius_km: radiusKm }),
  });
}

export async function getSetuPoints() {
  return await fetchJSON('/pool/setu-points');
}

// ─── Backhaul ───
export async function getDemoBackhaul() {
  return await fetchJSON('/backhaul/demo');
}

export async function getBackhaulTrucks() {
  return await fetchJSON('/backhaul/trucks');
}

export async function matchBackhaul(farmerId, farmerLocation, itemsNeeded) {
  return await fetchJSON('/backhaul/match', {
    method: 'POST',
    body: JSON.stringify({
      farmer_id: farmerId,
      farmer_location: farmerLocation,
      items_needed: itemsNeeded,
    }),
  });
}

// ─── Voice-to-Route ───
export async function voiceToRoute(text, language = 'hi') {
  return await fetchJSON('/voice-route', {
    method: 'POST',
    body: JSON.stringify({ text, language }),
  });
}

// ─── AI Explainer ───
export async function getExplanation(poolingResult) {
  return await fetchJSON('/explain', {
    method: 'POST',
    body: JSON.stringify({ pooling_result: poolingResult }),
  });
}

// ─── Health Check ───
export async function healthCheck() {
  return await fetchJSON('/health');
}
