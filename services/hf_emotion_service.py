import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from transformers import pipeline
from services.translation_service import translate_to_english

# Cargar modelo
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=1)
def analyze_emotion(text: str) -> dict:
    texto_en = translate_to_english(text)

    resultados = emotion_classifier(texto_en)[0]  # lista de dicts con label y score
    mejor = max(resultados, key=lambda x: x["score"])

    return {
        "emocion_detectada": mejor["label"],
        "score": round(mejor["score"], 3)
    }
