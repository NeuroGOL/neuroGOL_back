from extensions import db
from models.nlp_analysis_model import NLPAnalysis
from models.declaration_model import Declaration
from services.hf_emotion_service import analyze_emotion
from services.gemini_emotion_service import analyze_with_gemini

class NLPAnalysisService:

    @staticmethod
    def create_from_declaration(declaration_id: int) -> NLPAnalysis:
        declaration = Declaration.query.get(declaration_id)
        if not declaration:
            raise ValueError("Declaración no encontrada")

        # Paso 1: Hugging Face
        hf_result = analyze_emotion(declaration.texto)
        emocion = hf_result["emocion_detectada"]
        score = hf_result["score"]

        # Paso 2: Gemini
        gemini_data = analyze_with_gemini(declaration.texto, emocion)

        # Crear instancia
        analysis = NLPAnalysis(
            declaration_id=declaration_id,
            emocion_detectada=emocion,
            rendimiento_predicho=round(score, 3),
            tendencia_emocional=gemini_data["tendencia_emocional"],
            impacto_en_rendimiento=gemini_data["impacto_en_rendimiento"],
            impacto_en_equipo=gemini_data["impacto_en_equipo"],
            estado_actual_emocional=gemini_data["estado_actual_emocional"],
            resumen_general=gemini_data["resumen_general"],
            acciones_recomendadas=gemini_data["acciones_recomendadas"],
        )

        db.session.add(analysis)
        db.session.commit()
        return analysis

    @staticmethod
    def get_all():
        return NLPAnalysis.query.all()

    @staticmethod
    def get_by_id(id: int):
        return NLPAnalysis.query.get(id)

    @staticmethod
    def delete(id: int) -> bool:
        analysis = NLPAnalysis.query.get(id)
        if not analysis:
            return False
        db.session.delete(analysis)
        db.session.commit()
        return True
    
    @staticmethod
    def get_by_declaration_id(declaration_id: int):
        return NLPAnalysis.query.filter_by(declaration_id=declaration_id).first()


def serialize_nlp(analysis: NLPAnalysis) -> dict:
    return {
        "id": analysis.id,
        "declaration_id": analysis.declaration_id,
        "emocion_detectada": analysis.emocion_detectada,
        "tendencia_emocional": analysis.tendencia_emocional,
        "impacto_en_rendimiento": analysis.impacto_en_rendimiento,
        "impacto_en_equipo": analysis.impacto_en_equipo,
        "estado_actual_emocional": analysis.estado_actual_emocional,
        "rendimiento_predicho": analysis.rendimiento_predicho,
        "resumen_general": analysis.resumen_general,
        "acciones_recomendadas": analysis.acciones_recomendadas,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None
    }
