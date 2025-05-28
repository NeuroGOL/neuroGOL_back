from flask import Blueprint, request, jsonify
from services.user_service import UserService
from utils.error_handlers import APIError
from validators.user_validator import validate_profile_update

user_bp = Blueprint('user_bp', __name__, url_prefix="/users")

@user_bp.route("/", methods=["GET"])
def get_users():
    users = UserService.get_all_users()
    return jsonify(users)

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = UserService.get_user_by_id(user_id)
    return jsonify(user)

@user_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    try:
        new_user = UserService.create_user(data)
        return jsonify(UserService.serialize(new_user)), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    UserService.delete_user(user_id)
    return jsonify({"message": "Usuario eliminado correctamente"})

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()

    try:
        valid_data = validate_profile_update(data)
        updated_user = UserService.update_user(user_id, valid_data)
        return jsonify(UserService.serialize(updated_user)), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400