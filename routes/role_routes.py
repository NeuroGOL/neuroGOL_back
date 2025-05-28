from flask import Blueprint, request, jsonify
from services.role_service import RoleService
from utils.error_handlers import APIError
from validators.role_validator import validate_role_data  # 👈 Importa el validador

role_bp = Blueprint("roles", __name__, url_prefix="/roles")

@role_bp.route("/", methods=["GET"])
def get_roles():
    return jsonify(RoleService.get_all_roles())

@role_bp.route("/<int:role_id>", methods=["GET"])
def get_role(role_id):
    return jsonify(RoleService.get_role_by_id(role_id))

@role_bp.route("/", methods=["POST"])
def create_role():
    data = validate_role_data(request.get_json())  # 👈 Validación
    return jsonify(RoleService.create_role(data)), 201

@role_bp.route("/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    data = validate_role_data(request.get_json())  # 👈 Validación
    return jsonify(RoleService.update_role(role_id, data))

@role_bp.route("/<int:role_id>", methods=["DELETE"])
def delete_role(role_id):
    return jsonify(RoleService.delete_role(role_id))
