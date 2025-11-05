from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.error_handlers import APIError
from validators.user_validator import (
    validate_registration,
    validate_profile_update
)

user_bp = Blueprint('user_bp', __name__, url_prefix="/users")

# 🧾 Obtener todos los usuarios
@user_bp.route("/", methods=["GET"])
def get_users():
    users = UserService.get_all_users()
    return jsonify(users)

# 🔍 Obtener un usuario por ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = UserService.get_user_by_id(user_id)
    return jsonify(user)

# 🧑‍💻 Registrar nuevo usuario
@user_bp.route("", methods=["POST"])
def create_user():
    data = request.get_json()

    try:
        # ✅ Valida la entrada antes de crear el usuario
        valid_data = validate_registration(data)
        new_user = UserService.create_user(valid_data)
        return jsonify(UserService.serialize(new_user)), 201

    except APIError as e:
        # Errores personalizados (email duplicado, formato inválido, etc.)
        return jsonify({"error": str(e)}), e.status_code
    except ValueError as e:
        # Errores genéricos
        return jsonify({"error": str(e)}), 400

# 🗑️ Eliminar usuario
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    UserService.delete_user(user_id)
    return jsonify({"message": "Usuario eliminado correctamente"})

# ✏️ Actualizar perfil de usuario
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    try:
        # ✅ Valida datos de actualización (nombre, email, foto)
        valid_data = validate_profile_update(data)
        updated_user = UserService.update_user(user_id, valid_data)
        return jsonify(UserService.serialize(updated_user)), 200

    except APIError as e:
        return jsonify({"error": str(e)}), e.status_code
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
