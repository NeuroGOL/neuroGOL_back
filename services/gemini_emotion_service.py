import json
import google.genai as genai
from google.genai import types

# Configurar cliente con tu API key
client = genai.Client(api_key="AIzaSyBiF2sz9fpD7OUkyotW4zhSR8x86DuXmOA")

def analyze_with_gemini(texto: str, emocion_detectada: str) -> dict:
    prompt = f"""
Eres una inteligencia artificial especializada en el análisis emocional de declaraciones realizadas por jugadores de fútbol profesional colombiano (FPC).

Tu tarea es interpretar el siguiente texto para entender el estado emocional del jugador y cómo eso podría impactar su rendimiento deportivo y su entorno grupal:

---
"{texto}"
---

Ya se ha detectado previamente que la emoción dominante es: "{emocion_detectada}".

Con base en ese contexto, responde de forma precisa y **en formato JSON válido** con los siguientes campos:

{{
  "tendencia_emocional": "...",
  "impacto_en_rendimiento": "...",
  "impacto_en_equipo": "...",
  "estado_actual_emocional": "...",
  "resumen_general": "...",
  "acciones_recomendadas": "..."
}}

No expliques nada, no uses etiquetas markdown, devuelve solo JSON puro.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        # Limpiar posibles etiquetas ```json ... ```
        if text.startswith("```json") and text.endswith("```"):
            text = text[7:-3].strip()

        data = json.loads(text)

        # Validar campos obligatorios
        required_fields = [
            "tendencia_emocional",
            "impacto_en_rendimiento",
            "impacto_en_equipo",
            "estado_actual_emocional",
            "resumen_general",
            "acciones_recomendadas"
        ]
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Faltan campos en el JSON de Gemini: {missing}\nTexto recibido:\n{text}")

        return data

    except Exception as e:
        raise RuntimeError(f"Error al analizar con Gemini: {e}")
