from utils.error_handlers import APIError
from models.user_model import User

def validate_declaration_data(data):
    texto = data.get("texto", "").strip()
    user_id = data.get("user_id")

    if not texto or len(texto) < 10:
        raise APIError("El texto de la declaración debe tener al menos 10 caracteres", 400)

    if not user_id or not isinstance(user_id, int):
        raise APIError("El ID del usuario es obligatorio y debe ser un número", 400)

    user = User.query.get(user_id)
    if not user:
        raise APIError(f"No existe un usuario con ID {user_id}", 404)

    return {
        "texto": texto,
        "user_id": user_id
    }