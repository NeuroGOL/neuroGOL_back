
import os
import random
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Lista de API keys
# Cargar variables desde .env
load_dotenv()

# Preferencia: API_KEYS (coma-separados). Si no existe, probar API_KEY único o GEMINI_API_KEY.
api_keys_env = os.getenv("API_KEYS")
if api_keys_env:
    API_KEYS = [k.strip() for k in api_keys_env.split(",") if k.strip()]
else:
    single = os.getenv("API_KEY") or os.getenv("GEMINI_API_KEY")
    if single:
        API_KEYS = [single.strip()]
    else:
        # Buscar claves enumeradas: GEMINI_API_KEY_1, API_KEY_1, ...
        API_KEYS = []
        for i in range(1, 21):
            k = os.getenv(f"GEMINI_API_KEY_{i}") or os.getenv(f"API_KEY_{i}")
            if k:
                API_KEYS.append(k.strip())

if not API_KEYS:
    raise RuntimeError(
        "No se encontraron API keys. Defina API_KEYS (coma-separados), API_KEY, GEMINI_API_KEY o GEMINI_API_KEY_1..N en su .env"
    )


def get_random_client():
    """Devuelve un cliente de Gemini con una API key aleatoria"""
    api_key = random.choice(API_KEYS)
    return genai.Client(api_key=api_key)

def translate_to_english(text: str) -> str:
    prompt = f"""
Eres un traductor profesional. Traduce el siguiente texto al inglés de forma precisa, sin explicaciones adicionales ni rodeos. Devuelve **solo el texto traducido**, sin encabezados, sin comillas, sin formato markdown. Si el texto esta en otro idioma que no sea español, tradúcelo igualmente al inglés.

Texto a traducir:
{text}
"""

    # Intentar con cada API key
    for api_key in API_KEYS:
        client = genai.Client(api_key=api_key)
        
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )
            return response.text.strip()
            
        except Exception as e:
            error_str = str(e)
            if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
                print(f"API key {api_key[:10]}... excedió cuota, probando siguiente...")
                continue  # Probar siguiente key
            else:
                raise RuntimeError(f"Error al traducir el texto: {e}")
    
    # Si todas las keys fallaron
    raise RuntimeError("Todas las API keys han excedido su cuota. Por favor, espera unos minutos.")

