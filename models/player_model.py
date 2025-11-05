from extensions import db
from datetime import datetime

class Player(db.Model):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    equipo = db.Column(db.String(100), nullable=False)
    nacionalidad = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.String(), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
