import google.generativeai as genai

genai.configure(api_key="AIzaSyBiF2sz9fpD7OUkyotW4zhSR8x86DuXmOA")
model = genai.GenerativeModel("gemini-1.5-flash")

def translate_to_english(text: str) -> str:
    prompt = f"""
Eres un traductor profesional. Traduce el siguiente texto al inglés de forma precisa, sin explicaciones adicionales ni rodeos. Devuelve **solo el texto traducido**, sin encabezados, sin comillas, sin formato markdown.

Texto a traducir:
{text}
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Error al traducir el texto: {e}")
