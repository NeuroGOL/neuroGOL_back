import random
from google import genai
from google.genai import types

# Lista de API keys
API_KEYS = [
    "AIzaSyDTx8qSDyzD9Q96FD0jMAb7_npheFIXzE4",
    "AIzaSyBi_hSKX4FOtf0UH4RhQ7kIpeo5gDj4Qwk",
    "AIzaSyDNWJngukHKIGkK0JEZqXbiqhnpM41z_vc"
]

def get_random_client():
    """Devuelve un cliente de Gemini con una API key aleatoria"""
    api_key = random.choice(API_KEYS)
    return genai.Client(api_key=api_key)

def translate_to_english(text: str) -> str:
    client = get_random_client()  # Cada vez se usa una key aleatoria

    prompt = f"""
Eres un traductor profesional. Traduce el siguiente texto al inglés de forma precisa, sin explicaciones adicionales ni rodeos. Devuelve **solo el texto traducido**, sin encabezados, sin comillas, sin formato markdown.

Texto a traducir:
{text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Error al traducir el texto: {e}")
