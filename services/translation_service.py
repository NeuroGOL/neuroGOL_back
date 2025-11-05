
import random
from google import genai
from google.genai import types

# Lista de API keys
API_KEYS = [
"AIzaSyD5AHOI-ON4czU4daiXtKyhUOyUuLixjvc",
]

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

