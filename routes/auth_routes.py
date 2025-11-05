from flask import Blueprint, request, jsonify
from validators.user_validator import validate_registration, validate_login
from services.auth_service import AuthService
from utils.error_handlers import APIError
import traceback

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")


# 🧑‍💻 Registro de usuario
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    try:
        # ✅ Validar datos de registro
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

    except APIError as e:
        return jsonify({"error": str(e)}), e.status_code
    except Exception as e:
        # 🧾 Muestra error real en consola
        print("❌ Error inesperado en /auth/register:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# 🔐 Login de usuario
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    try:
        # ✅ Validar datos de login
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
        }), 200

    except APIError as e:
        return jsonify({"error": str(e)}), e.status_code
    except Exception as e:
        print("❌ Error inesperado en /auth/login:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
