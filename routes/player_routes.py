from flask import Blueprint, request, jsonify
from services.player_service import PlayerService
from utils.error_handlers import APIError

player_bp = Blueprint("players", __name__, url_prefix="/players")

@player_bp.route("/", methods=["GET"])
def get_players():
    return jsonify(PlayerService.get_all_players())

@player_bp.route("/<int:player_id>", methods=["GET"])
def get_player(player_id):
    return jsonify(PlayerService.get_player_by_id(player_id))

@player_bp.route("/", methods=["POST"])
def create_player():
    data = request.get_json()
    return jsonify(PlayerService.create_player(data)), 201

@player_bp.route("/<int:player_id>", methods=["PUT"])
def update_player(player_id):
    data = request.get_json()
    return jsonify(PlayerService.update_player(player_id, data))

@player_bp.route("/<int:player_id>", methods=["DELETE"])
def delete_player(player_id):
    return jsonify(PlayerService.delete_player(player_id))