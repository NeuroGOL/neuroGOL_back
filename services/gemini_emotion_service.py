import json
import random
import google.genai as genai
from google.genai import types

import os
import random

from services.translation_service import API_KEYS

# Leer la variable de entorno y convertirla en lista
api_keys = os.getenv("API_KEYS", "").split(",")

# Limpiar espacios en blanco por si acaso
api_keys = [key.strip() for key in api_keys if key.strip()]

# Ejemplo: elegir una clave aleatoria
chosen_key = random.choice(api_keys)
print("Usando API key:", chosen_key)

contexto_emocional = {
  "anger": {
    "definición": "Irritación o enojo frente a situaciones del juego o decisiones externas.",
    "impacto_rendimiento": "Puede aumentar la intensidad pero también generar faltas y pérdida de control.",
    "impacto_equipo": "Riesgo de conflictos internos o sanciones disciplinarias.",
    "ejemplo": "Estoy molesto porque el árbitro nos perjudicó."
  },
  "disgust": {
    "definición": "Rechazo o desagrado hacia una situación, resultado o comportamiento.",
    "impacto_rendimiento": "Reduce la motivación y la disposición a colaborar.",
    "impacto_equipo": "Puede generar apatía y falta de compromiso colectivo.",
    "ejemplo": "No me gustó cómo jugamos, fue un desastre."
  },
  "fear": {
    "definición": "Sensación de inseguridad o preocupación por el futuro rendimiento.",
    "impacto_rendimiento": "Disminuye la confianza y puede limitar la toma de riesgos.",
    "impacto_equipo": "Genera tensión y contagia inseguridad al grupo.",
    "ejemplo": "Tengo miedo de no estar a la altura en el próximo partido."
  },
  "joy": {
    "definición": "Alegría y satisfacción por logros individuales o colectivos.",
    "impacto_rendimiento": "Aumenta la motivación y la confianza en el juego.",
    "impacto_equipo": "Fortalece la cohesión y el ánimo grupal.",
    "ejemplo": "Estoy feliz con el resultado y cómo jugamos juntos."
  },
  "neutral": {
    "definición": "Estado emocional equilibrado, sin carga positiva ni negativa marcada.",
    "impacto_rendimiento": "Permite objetividad pero puede reflejar falta de energía.",
    "impacto_equipo": "Mantiene estabilidad, aunque sin aportar entusiasmo.",
    "ejemplo": "Fue un partido más, cumplimos lo que se esperaba."
  },
  "sadness": {
    "definición": "Tristeza por derrotas, errores o situaciones personales.",
    "impacto_rendimiento": "Disminuye la concentración y la energía física.",
    "impacto_equipo": "Puede contagiar desánimo y reducir la moral colectiva.",
    "ejemplo": "Me siento muy triste por la derrota, no era lo que esperábamos."
  },
  "surprise": {
    "definición": "Reacción inesperada frente a un resultado o situación imprevista.",
    "impacto_rendimiento": "Puede generar motivación extra o desconcierto temporal.",
    "impacto_equipo": "Activa discusiones y reajustes en la estrategia.",
    "ejemplo": "Me sorprendió el nivel del rival, no lo esperábamos tan fuerte."
  }
}


def get_random_client():
    """Devuelve un cliente de Gemini con una API key aleatoria"""
    api_key = random.choice(API_KEYS)
    return genai.Client(api_key=api_key)

def analyze_with_gemini(texto: str, emocion_detectada: str) -> dict:
    client = get_random_client()

    prompt = f"""
Eres una inteligencia artificial especializada en el análisis emocional de declaraciones realizadas por jugadores de fútbol profesional colombiano (FPC).

Usa el siguiente diccionario de contexto para interpretar mejor las emociones:
{json.dumps(contexto_emocional, ensure_ascii=False, indent=2)}

Tu tarea es interpretar el siguiente texto para entender el estado emocional del jugador y cómo eso podría impactar su rendimiento deportivo y su entorno grupal:

---
"{texto}"
---

La emoción dominante ya ha sido detectada como: "{emocion_detectada}".  
**Debes priorizar esta emoción en tu análisis, incluso si aparecen matices de otras emociones.**  
El diccionario anterior debe servir como referencia obligatoria para tu interpretación.  

Responde en formato JSON válido con los siguientes campos:

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
        # Configuración de seguridad y parámetros
        generate_content_config = types.GenerateContentConfig(
            temperature=0.3,
            top_p=0.8,
            top_k=40,
            max_output_tokens=1024,
            safety_settings=[
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                ),
                types.SafetySetting(
                    category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold=types.HarmBlockThreshold.BLOCK_ONLY_HIGH
                )
            ]
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",  # Usa el modelo experimental más reciente
            contents=prompt,
            config=generate_content_config
        )

        # Verificar si la respuesta está vacía o fue bloqueada
        if not response.text:
            # Verificar si hay candidatos bloqueados
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'finish_reason') and candidate.finish_reason:
                    if candidate.finish_reason == "SAFETY":
                        raise RuntimeError("La respuesta fue bloqueada por filtros de seguridad")
                    elif candidate.finish_reason == "OTHER":
                        raise RuntimeError("La respuesta fue bloqueada por otras razones")
            
            # Si no hay texto y no hay candidatos, es una respuesta vacía
            raise RuntimeError("Respuesta vacía de Gemini - El modelo no generó contenido")

        text = response.text.strip()

        # Limpiar posibles etiquetas ```json ... ```
        if text.startswith("```json") and text.endswith("```"):
            text = text[7:-3].strip()
        elif text.startswith("```") and text.endswith("```"):
            text = text[3:-3].strip()

        # Intentar parsear el JSON
        try:
            data = json.loads(text)
        except json.JSONDecodeError as e:
            # Si falla el parseo, intentar extraer JSON del texto
            print(f"Error parseando JSON directo. Texto recibido: {text}")
            # Buscar el primer { y el último }
            start_idx = text.find('{')
            end_idx = text.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = text[start_idx:end_idx]
                data = json.loads(json_str)
            else:
                raise RuntimeError(f"No se pudo extraer JSON válido: {e}")

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
            raise ValueError(f"Faltan campos en el JSON: {missing}")

        return data

    except Exception as e:
        raise RuntimeError(f"Error al analizar con Gemini: {e}")

# Función de prueba
def test_gemini_connection():
    """Función para probar la conexión con Gemini"""
    try:
        client = get_random_client()
        test_response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents="Responde con 'OK' si estás funcionando correctamente."
        )
        print("✅ Conexión con Gemini exitosa")
        print(f"Respuesta de prueba: {test_response.text}")
        return True
    except Exception as e:
        print(f"❌ Error en conexión: {e}")
        return False

# Ejemplo de uso
if __name__ == "__main__":
    # Probar conexión primero
    if test_gemini_connection():
        # Probar análisis emocional
        try:
            resultado = analyze_with_gemini(
                "Estoy muy feliz con mi rendimiento en el último partido, el equipo funcionó muy bien",
                "alegría"
            )
            print("✅ Análisis exitoso:")
            print(json.dumps(resultado, indent=2, ensure_ascii=False))
        except Exception as e:
            print(f"❌ Error en análisis: {e}")