from extensions import db
from models.user_model import User
from utils.error_handlers import APIError
import bcrypt
from flask_jwt_extended import create_access_token

class AuthService:
    @staticmethod
    def register_user(valid_data):
        hashed_pw = bcrypt.hashpw(valid_data["password"].encode("utf-8"), bcrypt.gensalt())

        new_user = User(
            nombre=valid_data["nombre"],
            email=valid_data["email"],
            password=hashed_pw.decode("utf-8"),
            role_id=valid_data["role_id"],
            profile_picture=valid_data.get("profile_picture")
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def login_user(user: User, plain_pw: str):
        if not bcrypt.checkpw(plain_pw.encode("utf-8"), user.password.encode("utf-8")):
            raise APIError("Contraseña incorrecta", 401)

        return create_access_token(identity=user.id)
