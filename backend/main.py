# main.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import httpx
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="API Asistente de Comida")

# CORS (en dev "*" está bien; en prod restringir a tus dominios)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lee la key preferentemente GEMINI_API_KEY; si todavía usas VITE_ lo tomo como fallback
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logging.warning("GEMINI_API_KEY no encontrado en variables de entorno. Setea GEMINI_API_KEY en tu .env")

# Modelo por defecto; puedes usar "gemini-2.5-pro" o "models/gemini-2.5-pro"
raw_model = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
# Normalizar para que tenga el prefijo "models/"
GEMINI_MODEL = raw_model if raw_model.startswith("models/") else f"models/{raw_model}"

GEMINI_API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta"

# client será creado en startup y cerrado en shutdown
client: httpx.AsyncClient | None = None

class ChatRequest(BaseModel):
    message: str

class RecipeRequest(BaseModel):
    ingredients: list[str]
    preferences: str = ""

@app.on_event("startup")
async def startup_event():
    global client
    client = httpx.AsyncClient(timeout=30.0)
    logging.info("Httpx AsyncClient creado en startup")

@app.on_event("shutdown")
async def shutdown_event():
    global client
    if client:
        await client.aclose()
        logging.info("Httpx AsyncClient cerrado en shutdown")

@app.get("/")
async def root():
    return {"message": "API de Asistente de Comida"}

async def call_gemini(payload: dict) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY no configurado en el servidor")
    if not client:
        raise RuntimeError("HTTP client no inicializado")

    # usa MODEL_ID (sin el prefijo 'models/')
    url = f"{GEMINI_API_URL_BASE}/{GEMINI_MODEL}:generateContent"
    logging.info("Llamando a Gemini url=%s", url)

    resp = await client.post(url, json=payload, params={"key": GEMINI_API_KEY})

    if resp.status_code == 404:
        logging.error("Modelo o endpoint no encontrado. Status 404: %s", resp.text)
        raise HTTPException(
            status_code=404,
            detail=("Modelo no encontrado o no soporta generateContent. "
                    "Visita GET /api/models para listar modelos disponibles y actualiza GEMINI_MODEL.")
        )

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        logging.error("Error desde Gemini: %s - %s", resp.status_code, resp.text)
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    try:
        return resp.json()
    except ValueError:
        logging.exception("Respuesta no JSON de Gemini")
        raise HTTPException(status_code=502, detail="Respuesta no JSON desde Gemini")


@app.post("/api/speech-to-text")
async def speech_to_text(file: UploadFile = File(...)):
    """
    Recibe un archivo de audio y devuelve la transcripción usando Gemini.
    """
    try:
        import base64

        audio_bytes = await file.read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        mime_type = file.content_type or "audio/webm"

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": "Transcribe el siguiente audio a texto en español:"
                        },
                        {
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": audio_base64
                            }
                        }
                    ]
                }
            ]
        }

        data = await call_gemini(payload)

        text = None
        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            text = data.get("text") or (data.get("output") and data["output"].get("text"))

        if not text:
            logging.error("Estructura inesperada de Gemini en audio: %s", data)
            raise HTTPException(status_code=502, detail="No se pudo obtener transcripción")

        return {"transcript": text}

    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Error en /api/speech-to-text")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        payload = {
            "contents": [
                {"parts": [{"text": request.message}]}
            ]
        }
        data = await call_gemini(payload)

        # Validación defensiva de la estructura de respuesta
        text = None
        if isinstance(data, dict):
            try:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception:
                text = data.get("text") or (data.get("output") and data["output"].get("text"))

        if not text:
            logging.error("Estructura inesperada de Gemini: %s", data)
            raise HTTPException(status_code=502, detail="Estructura inesperada en respuesta de Gemini")

        return {"response": text}
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Error en /api/chat")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recipes")
async def get_recipes(request: RecipeRequest):
    try:
        prompt = f"""Eres un asistente culinario experto. Basándote en los siguientes ingredientes: {', '.join(request.ingredients)}
{f'Preferencias adicionales: {request.preferences}' if request.preferences else ''}

Genera 3 recetas detalladas en formato JSON con la siguiente estructura:
[
  {{
    "name": "Nombre de la receta",
    "description": "Descripción breve",
    "prepTime": "tiempo en minutos",
    "difficulty": "fácil/media/difícil",
    "ingredients": ["ingrediente 1", "ingrediente 2"],
    "instructions": ["paso 1", "paso 2"]
  }}
]

Responde SOLO con el JSON, sin texto adicional.
"""

        payload = {"contents": [{"parts": [{"text": prompt}]}]}
        data = await call_gemini(payload)

        # Extraer texto generado (manejo defensivo)
        recipes_text = None
        try:
            recipes_text = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception:
            recipes_text = data.get("text")

        if not recipes_text:
            logging.error("Respuesta de Gemini sin texto (recipes): %s", data)
            raise HTTPException(status_code=502, detail="Respuesta inesperada de Gemini")

        # Limpiar posibles fences ```json ... ```
        recipes_text = recipes_text.strip()
        if recipes_text.startswith("```json"):
            recipes_text = recipes_text[len("```json"):].strip()
            if recipes_text.endswith("```"):
                recipes_text = recipes_text[:-3].strip()

        import json
        try:
            recipes = json.loads(recipes_text)
        except json.JSONDecodeError:
            logging.exception("No se pudo parsear JSON devuelto por Gemini")
            raise HTTPException(status_code=502, detail="Gemini devolvió texto que no es JSON válido")

        return {"recipes": recipes}
    except HTTPException:
        raise
    except Exception as e:
        logging.exception("Error en /api/recipes")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
