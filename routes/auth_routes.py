from flask import Blueprint, request, jsonify
from validators.user_validator import validate_registration, validate_login
from services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    valid_data = validate_registration(data)
    new_user = AuthService.register_user(valid_data)

    return jsonify({
        "message": "Usuario registrado correctamente",
        "user": {
            "id": new_user.id,
            "nombre": new_user.nombre,
            "email": new_user.email,
            "role_id": new_user.role_id
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user, plain_pw = validate_login(data)
    token = AuthService.login_user(user, plain_pw)

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "email": user.email,
            "role_id": user.role_id
        }
    })
