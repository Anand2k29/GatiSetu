"""
GatiSetu — LLM Router
Dual-provider pipeline: OpenRouter (free) → Gemini (fallback) → Mock.
Same pattern as AarogyaVani's inferenceService.ts.
"""

import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Model priority on OpenRouter (free models)
OPENROUTER_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "qwen/qwen3-235b-a22b:free",
]


async def call_llm(prompt: str, system_prompt: str = "") -> tuple[str, str]:
    """
    Try LLM providers in order. Returns (response_text, provider_name).
    1. OpenRouter (free models)
    2. Gemini API direct
    3. Returns empty string (caller handles mock)
    """

    # ── 1. Try OpenRouter ──────────────────────────────────────
    if OPENROUTER_API_KEY:
        for model in OPENROUTER_MODELS:
            try:
                result = await _call_openrouter(prompt, system_prompt, model)
                if result:
                    return result, f"OpenRouter/{model.split('/')[-1]}"
            except Exception as e:
                print(f"[LLM Router] OpenRouter {model} failed: {e}")
                continue

    # ── 2. Try Gemini API ──────────────────────────────────────
    if GEMINI_API_KEY:
        try:
            result = await _call_gemini(prompt, system_prompt)
            if result:
                return result, "Gemini"
        except Exception as e:
            print(f"[LLM Router] Gemini failed: {e}")

    # ── 3. Fallback ────────────────────────────────────────────
    print("[LLM Router] All providers failed, returning empty for mock fallback")
    return "", "mock"


async def _call_openrouter(prompt: str, system_prompt: str, model: str) -> str:
    """Call OpenRouter API (same pattern as AarogyaVani)."""
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "GatiSetu"
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.1,
                "max_tokens": 1024,
            }
        )

        if response.status_code != 200:
            raise Exception(f"OpenRouter HTTP {response.status_code}: {response.text[:200]}")

        data = response.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        return content.strip()


async def _call_gemini(prompt: str, system_prompt: str) -> str:
    """Call Gemini API directly via REST."""
    full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": full_prompt}]}],
                "generationConfig": {
                    "temperature": 0.1,
                    "maxOutputTokens": 1024,
                }
            }
        )

        if response.status_code != 200:
            raise Exception(f"Gemini HTTP {response.status_code}: {response.text[:200]}")

        data = response.json()
        content = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )
        return content.strip()
