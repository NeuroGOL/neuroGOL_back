from extensions import db
from datetime import datetime

class NLPAnalysis(db.Model):
    __tablename__ = 'nlp_analysis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    declaration_id = db.Column(db.Integer, db.ForeignKey('declarations.id'), nullable=False)
    emocion_detectada = db.Column(db.String(50), nullable=False)
    tendencia_emocional = db.Column(db.Text, nullable=False)
    impacto_en_rendimiento = db.Column(db.Text, nullable=False)
    impacto_en_equipo = db.Column(db.Text, nullable=False)
    estado_actual_emocional = db.Column(db.Text, nullable=False)
    rendimiento_predicho = db.Column(db.Float, nullable=False) 
    resumen_general = db.Column(db.Text, nullable=False)
    acciones_recomendadas = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    declaration = db.relationship('Declaration', backref='nlp_analysis')
