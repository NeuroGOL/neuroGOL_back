from extensions import db
from models.report_model import Report

class ReportService:

    @staticmethod
    def create(data: dict) -> Report:
        new_report = Report(**data)
        db.session.add(new_report)
        db.session.commit()
        return new_report

    @staticmethod
    def get_all() -> list:
        return Report.query.all()

    @staticmethod
    def get_by_id(report_id: int) -> Report:
        return Report.query.get(report_id)

    @staticmethod
    def delete(report_id: int) -> bool:
        report = Report.query.get(report_id)
        if not report:
            return False
        db.session.delete(report)
        db.session.commit()
        return True

def serialize_report(report: Report) -> dict:
    return {
        "id": report.id,
        "player_id": report.player_id,
        "declaration_id": report.declaration_id,
        "nlp_analysis_id": report.nlp_analysis_id,
        "generado_por": report.generado_por,
        "created_at": report.created_at.isoformat() if report.created_at else None
    }
