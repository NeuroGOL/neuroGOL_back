from utils.error_handlers import APIError
from models.player_model import Player
from models.user_model import User
from models.declaration_model import Declaration
from models.nlp_analysis_model import NLPAnalysis
from models.report_model import Report

def validate_report_data(data):
    player_id = data.get("player_id")
    declaration_id = data.get("declaration_id")
    nlp_analysis_id = data.get("nlp_analysis_id")
    generado_por = data.get("generado_por")

    if not all([player_id, declaration_id, nlp_analysis_id, generado_por]):
        raise APIError("Faltan campos obligatorios", 400)

    if not isinstance(player_id, int):
        raise APIError("player_id debe ser un número entero", 400)

    if not isinstance(declaration_id, int):
        raise APIError("declaration_id debe ser un número entero", 400)

    if not isinstance(nlp_analysis_id, int):
        raise APIError("nlp_analysis_id debe ser un número entero", 400)

    if not isinstance(generado_por, int):
        raise APIError("generado_por debe ser un número entero", 400)

    if not Player.query.get(player_id):
        raise APIError(f"Jugador con id {player_id} no encontrado", 404)

    if not Declaration.query.get(declaration_id):
        raise APIError(f"Declaración con id {declaration_id} no encontrada", 404)

    if not NLPAnalysis.query.get(nlp_analysis_id):
        raise APIError(f"Análisis NLP con id {nlp_analysis_id} no encontrado", 404)

    if not User.query.get(generado_por):
        raise APIError(f"Usuario con id {generado_por} no encontrado", 404)

    if not Declaration.query.get(declaration_id):
        raise APIError(f"Declaración con id {declaration_id} no encontrada", 404)

    analysis = NLPAnalysis.query.get(nlp_analysis_id)
    if not analysis:
        raise APIError(f"Análisis NLP con id {nlp_analysis_id} no encontrado", 404)

    if analysis.declaration_id != declaration_id:
        raise APIError("El análisis NLP no corresponde a la declaración proporcionada", 400)

    if not User.query.get(generado_por):
        raise APIError(f"Usuario con id {generado_por} no encontrado", 404)
    
    existing_report = Report.query.filter_by(
        player_id=player_id,
        declaration_id=declaration_id,
        nlp_analysis_id=nlp_analysis_id,
        generado_por=generado_por
    ).first()

    if existing_report:
        raise APIError("Ya existe un reporte con esta combinación de jugador, declaración, análisis y usuario", 400)


    return {
        "player_id": player_id,
        "declaration_id": declaration_id,
        "nlp_analysis_id": nlp_analysis_id,
        "generado_por": generado_por,
    }
