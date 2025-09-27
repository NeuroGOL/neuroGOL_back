from extensions import db
from models.role_model import Role
from utils.error_handlers import APIError

class RoleService:
    @staticmethod
    def get_all_roles():
        return [role.to_dict() for role in Role.query.all()]

    @staticmethod
    def get_role_by_id(role_id):
        role = Role.query.get(role_id)
        if not role:
            raise APIError("Rol no encontrado", 404)
        return role.to_dict()

    @staticmethod
    def create_role(data):
        if Role.query.filter_by(nombre=data["nombre"]).first():
            raise APIError("Ese nombre de rol ya existe", 400)

        role = Role(nombre=data["nombre"])
        db.session.add(role)
        db.session.commit()
        return role.to_dict()

    @staticmethod
    def update_role(role_id, data):
        role = Role.query.get(role_id)
        if not role:
            raise APIError("Rol no encontrado", 404)

        role.nombre = data["nombre"]
        db.session.commit()
        return role.to_dict()

    @staticmethod
    def delete_role(role_id):
        role = Role.query.get(role_id)
        if not role:
            raise APIError("Rol no encontrado", 404)

        db.session.delete(role)
        db.session.commit()
        return {"message": "Rol eliminado correctamente"}
