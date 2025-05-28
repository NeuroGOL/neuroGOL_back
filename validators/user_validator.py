import re
from utils.error_handlers import APIError
from models.user_model import User

def validate_registration(data):
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("contrasena", "")
    confirmar = data.get("confirmar_contrasena", "")
    role_id = data.get("role_id", 2)

    if len(nombre) < 3:
        raise APIError("El nombre debe tener al menos 3 caracteres", 400)

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise APIError("Email inválido", 400)

    if len(password) < 6:
        raise APIError("La contraseña debe tener al menos 6 caracteres", 400)

    if password != confirmar:
        raise APIError("Las contraseñas no coinciden", 400)

    if User.query.filter_by(email=email).first():
        raise APIError("Este correo ya está registrado", 400)

    return {
        "nombre": nombre,
        "email": email,
        "password": password,  # ✅ clave estándar
        "role_id": role_id,
        "profile_picture": data.get("profile_picture")
    }

def validate_login(data):
    email = data.get("email", "").strip().lower()
    password = data.get("contrasena", "")  # 📝 sigue viniendo como 'contrasena' desde frontend

    if not email or not password:
        raise APIError("Email y contraseña son requeridos", 400)

    user = User.query.filter_by(email=email).first()
    if not user:
        raise APIError("Usuario no encontrado", 404)

    return user, password


def validate_profile_update(data):
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
    profile_picture = data.get("profile_picture", "").strip()

    if len(nombre) < 3:
        raise APIError("El nombre debe tener al menos 3 caracteres", 400)

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise APIError("Email inválido", 400)
    
    return {
        "nombre": nombre,
        "email": email,
        "profile_picture": profile_picture or None
    }