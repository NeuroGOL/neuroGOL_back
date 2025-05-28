from flask import Blueprint, request, jsonify
from services.report_service import ReportService, serialize_report
from validators.report_validator import validate_report_data

report_bp = Blueprint('report_bp', __name__, url_prefix='/reports')

@report_bp.route('', methods=['POST'])
def create():
    data = request.get_json()
    validated_data = validate_report_data(data)
    report = ReportService.create(validated_data)
    return jsonify(serialize_report(report)), 201


@report_bp.route('', methods=['GET'])
def get_all():
    reports = ReportService.get_all()
    return jsonify([serialize_report(r) for r in reports]), 200


@report_bp.route('/<int:report_id>', methods=['GET'])
def get_by_id(report_id):
    report = ReportService.get_by_id(report_id)
    if not report:
        return jsonify({"error": "Reporte no encontrado"}), 404
    return jsonify(serialize_report(report)), 200


@report_bp.route('/<int:report_id>', methods=['DELETE'])
def delete(report_id):
    success = ReportService.delete(report_id)
    if not success:
        return jsonify({"error": "Reporte no encontrado"}), 404
    return jsonify({"message": f"Reporte con ID {report_id} eliminado correctamente."}), 200
