from extensions import bcrypt
from extensions import db
from models.user_model import User
from utils.error_handlers import APIError

class UserService:
    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [UserService.serialize(u) for u in users]

    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)
        if not user:
            raise APIError("Usuario no encontrado", 404)
        return UserService.serialize(user)

    @staticmethod
    def create_user(data):
        required_fields = ["nombre", "email", "password", "role_id"]

        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"El campo '{field}' es requerido.")

        # Continúa normalmente si todo está bien
        hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

        new_user = User(
            nombre=data["nombre"],
            email=data["email"],
            password=hashed_pw,
            role_id=data["role_id"]
        )

        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            raise APIError("Usuario no encontrado", 404)
        db.session.delete(user)
        db.session.commit()
        return True
    
    @staticmethod
    def update_user(user_id, data):
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError("Usuario no encontrado")

        user.nombre = data.get("nombre", user.nombre)
        user.email = data.get("email", user.email)
        user.profile_picture = data.get("profile_picture", user.profile_picture)

        db.session.commit()
        return user



    @staticmethod
    def serialize(user):
        return {
            "id": user.id,
            "nombre": user.nombre,
            "email": user.email,
            "role_id": user.role_id,
            "profile_picture": user.profile_picture,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
