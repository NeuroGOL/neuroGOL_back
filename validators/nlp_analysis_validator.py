from models.nlp_analysis_model import NLPAnalysis
from models.declaration_model import Declaration

def validate_nlp_request(data):
    if not data:
        return False, "No se recibió ninguna información en la solicitud."

    # Validar que exista declaration_id
    declaration_id = data.get("declaration_id")
    if declaration_id is None:
        return False, "El campo 'declaration_id' es obligatorio."

    # Validar tipo de dato
    if not isinstance(declaration_id, int):
        return False, "El campo 'declaration_id' debe ser un número entero."

    # Validar existencia de la declaración
    declaration = Declaration.query.get(declaration_id)
    if not declaration:
        return False, f"No existe ninguna declaración con ID {declaration_id}."

    # Validar que no exista un análisis emocional ya creado para esta declaración
    existing = NLPAnalysis.query.filter_by(declaration_id=declaration_id).first()
    if existing:
        return False, f"Ya existe un análisis emocional para la declaración con ID {declaration_id}."

    return True, None
