from extensions import db
from models.declaration_model import Declaration
from utils.error_handlers import APIError

class DeclarationService:

    @staticmethod
    def get_all_declarations():
        declarations = Declaration.query.all()
        return [declaration.to_dict() for declaration in declarations]

    @staticmethod
    def get_declaration_by_id(declaration_id):
        declaration = Declaration.query.get(declaration_id)
        if not declaration:
            raise APIError("Declaración no encontrada", 404)
        return declaration.to_dict()

    @staticmethod
    def create_declaration(data):
        required_fields = ["player_id", "user_id", "categoria_texto", "fuente", "texto"]
        for field in required_fields:
            if field not in data:
                raise APIError(f"Campo requerido faltante: {field}", 400)

        new_declaration = Declaration(
            player_id=data["player_id"],
            user_id=data["user_id"],
            categoria_texto=data["categoria_texto"],
            fuente=data["fuente"],
            texto=data["texto"]
        )

        db.session.add(new_declaration)
        db.session.commit()
        return DeclarationService.serialize(new_declaration)

    @staticmethod
    def update_declaration(declaration_id, data):
        declaration = Declaration.query.get(declaration_id)
        if not declaration:
            raise APIError("Declaración no encontrada", 404)

        for key, value in data.items():
            if hasattr(declaration, key):
                setattr(declaration, key, value)

        db.session.commit()
        return declaration.to_dict()

    @staticmethod
    def delete_declaration(declaration_id):
        declaration = Declaration.query.get(declaration_id)
        if not declaration:
            raise APIError("Declaración no encontrada", 404)

        db.session.delete(declaration)
        db.session.commit()
        return {"message": "Declaración eliminada correctamente"}
    
    @staticmethod
    def serialize(declaration):
        return {
            "id": declaration.id,
            "player_id": declaration.player_id,
            "user_id": declaration.user_id,
            "categoria_texto": declaration.categoria_texto,
            "fuente": declaration.fuente,
            "texto": declaration.texto,
            "created_at": declaration.created_at.isoformat() if declaration.created_at else None
        }
