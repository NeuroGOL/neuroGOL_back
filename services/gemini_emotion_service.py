import json
import random
import google.genai as genai
from google.genai import types

# Array de API keys
API_KEYS = [
    "AIzaSyD5AHOI-ON4czU4daiXtKyhUOyUuLixjvc",
]

def get_random_client():
    """Devuelve un cliente de Gemini con una API key aleatoria"""
    api_key = random.choice(API_KEYS)
    return genai.Client(api_key=api_key)

def analyze_with_gemini(texto: str, emocion_detectada: str) -> dict:
    client = get_random_client()

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