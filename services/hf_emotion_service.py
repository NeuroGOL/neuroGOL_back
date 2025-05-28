import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from transformers import pipeline
from services.translation_service import translate_to_english

# Cargar modelo
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)

def analyze_emotion(text: str) -> dict:
    # Traducir el texto si es necesario
    texto_en = translate_to_english(text)

    resultado = emotion_classifier(texto_en)[0][0]  # {'label': 'joy', 'score': 0.98}
    emocion = resultado["label"]
    score = resultado["score"]

    return {
        "emocion_detectada": emocion,
        "score": round(score, 3)
    }
