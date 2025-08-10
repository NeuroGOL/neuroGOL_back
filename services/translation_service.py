from google import genai
from google.genai import types

# Configurar el cliente con tu API key
client = genai.Client(api_key="AIzaSyBiF2sz9fpD7OUkyotW4zhSR8x86DuXmOA")

def translate_to_english(text: str) -> str:
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
