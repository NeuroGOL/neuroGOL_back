from models.player_model import Player
from extensions import db
from utils.error_handlers import APIError

def to_dict(player):
    return {
        "id": player.id,
        "nombre": player.nombre,
        "equipo": player.equipo,
        "nacionalidad": player.nacionalidad,
        "profile_picture": player.profile_picture
    }

class PlayerService:
    @staticmethod
    def get_all_players():
        return [to_dict(p) for p in Player.query.all()]

    @staticmethod
    def get_player_by_id(player_id):
        player = Player.query.get(player_id)
        if not player:
            raise APIError("Jugador no encontrado", 404)
        return to_dict(player)

    @staticmethod
    def create_player(data):
        player = Player(
            nombre=data["nombre"],
            equipo=data["equipo"],
            nacionalidad=data["nacionalidad"],
            profile_picture=data.get("profile_picture")
        )
        db.session.add(player)
        db.session.commit()
        return to_dict(player)

    @staticmethod
    def update_player(player_id, data):
        player = Player.query.get(player_id)
        if not player:
            raise APIError("Jugador no encontrado", 404)

        player.nombre = data.get("nombre", player.nombre)
        player.equipo = data.get("equipo", player.equipo)
        player.nacionalidad = data.get("nacionalidad", player.nacionalidad)
        player.profile_picture = data.get("profile_picture", player.profile_picture)

        db.session.commit()
        return to_dict(player)

    @staticmethod
    def delete_player(player_id):
        player = Player.query.get(player_id)
        if not player:
            raise APIError("Jugador no encontrado", 404)

        db.session.delete(player)
        db.session.commit()
        return {"message": "Jugador eliminado correctamente"}
