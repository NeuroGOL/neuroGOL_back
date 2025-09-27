from flask import Blueprint, request, jsonify
from services.declaration_service import DeclarationService
from utils.error_handlers import APIError

declaration_bp = Blueprint("declarations", __name__, url_prefix="/declarations")

@declaration_bp.route("/", methods=["GET"])
def get_declarations():
    return jsonify(DeclarationService.get_all_declarations())

@declaration_bp.route("/<int:declaration_id>", methods=["GET"])
def get_declaration(declaration_id):
    return jsonify(DeclarationService.get_declaration_by_id(declaration_id))

@declaration_bp.route("/", methods=["POST"])
def create_declaration():
    data = request.get_json()
    return jsonify(DeclarationService.create_declaration(data)), 201

@declaration_bp.route("/<int:declaration_id>", methods=["PUT"])
def update_declaration(declaration_id):
    data = request.get_json()
    return jsonify(DeclarationService.update_declaration(declaration_id, data))

@declaration_bp.route("/<int:declaration_id>", methods=["DELETE"])
def delete_declaration(declaration_id):
    return jsonify(DeclarationService.delete_declaration(declaration_id))
