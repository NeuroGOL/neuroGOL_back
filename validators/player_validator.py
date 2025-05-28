from utils.error_handlers import APIError
from models.user_model import User


def validate_player_data(data):
    nombre = data.get("nombre", "").strip()
    equipo = data.get("equipo", "").strip()
    nacionalidad = data.get("nacionalidad", "").strip()
    user_id = data.get("user_id")

    if not nombre or len(nombre) < 3:
        raise APIError("El nombre del jugador es requerido y debe tener al menos 3 caracteres", 400)

    if not equipo:
        raise APIError("El equipo del jugador es obligatorio", 400)

    if not nacionalidad:
        raise APIError("La nacionalidad del jugador es obligatoria", 400)

    if not user_id or not isinstance(user_id, int):
        raise APIError("El ID del usuario es obligatorio y debe ser un entero", 400)

    user = User.query.get(user_id)
    if not user:
        raise APIError(f"No existe un usuario con ID {user_id}", 404)

    return {
        "nombre": nombre,
        "equipo": equipo,
        "nacionalidad": nacionalidad,
        "user_id": user_id
    }
