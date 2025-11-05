from extensions import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    declaration_id = db.Column(db.Integer, db.ForeignKey('declarations.id'), nullable=False)
    nlp_analysis_id = db.Column(db.Integer, db.ForeignKey('nlp_analysis.id'), nullable=False)
    generado_por = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    player = db.relationship('Player')
    declaration = db.relationship('Declaration')
    nlp_analysis = db.relationship('NLPAnalysis')
    user = db.relationship('User')
