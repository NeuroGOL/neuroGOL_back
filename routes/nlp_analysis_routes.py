from flask import Blueprint, request, jsonify
from services.nlp_analysis_service import NLPAnalysisService, serialize_nlp
from validators.nlp_analysis_validator import validate_nlp_request

nlp_analysis_bp = Blueprint('nlp_analysis_bp', __name__, url_prefix='/nlp')

@nlp_analysis_bp.route('', methods=['POST'])
def create():
    data = request.get_json()

    is_valid, error = validate_nlp_request(data)
    if not is_valid:
        return jsonify({"error": error}), 400

    declaration_id = data["declaration_id"]
    try:
        analysis = NLPAnalysisService.create_from_declaration(declaration_id)
        return jsonify(serialize_nlp(analysis)), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@nlp_analysis_bp.route('', methods=['GET'])
def get_all():
    analyses = NLPAnalysisService.get_all()
    return jsonify([serialize_nlp(a) for a in analyses]), 200

@nlp_analysis_bp.route('/<int:id>', methods=['GET'])
def get_by_id(id):
    analysis = NLPAnalysisService.get_by_id(id)
    if not analysis:
        return jsonify({"error": "NLPAnalysis no encontrado"}), 404
    return jsonify(serialize_nlp(analysis)), 200

@nlp_analysis_bp.route('/<int:id>', methods=['DELETE'])
def delete(id):
    success = NLPAnalysisService.delete(id)
    if not success:
        return jsonify({"error": "NLPAnalysis no encontrado"}), 404
    return jsonify({"message": f"NLPAnalysis con ID {id} eliminado correctamente."}), 200


@nlp_analysis_bp.route('/<int:id>', methods=['GET'])
def get_analysis(id):
    analysis = NLPAnalysisService.get_by_id(id)
    if not analysis:
        return jsonify({"error": "Análisis no encontrado"}), 404
    return jsonify(serialize_nlp(analysis))

# ✅ NUEVO: Obtener análisis por ID de declaración
@nlp_analysis_bp.route('/declaration/<int:declaration_id>', methods=['GET'])
def get_analysis_by_declaration(declaration_id):
    analysis = NLPAnalysisService.get_by_declaration_id(declaration_id)
    if not analysis:
        return jsonify({"error": "No se encontró análisis para esta declaración"}), 404
    return jsonify(serialize_nlp(analysis))