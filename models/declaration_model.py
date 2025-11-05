from extensions import db
from datetime import datetime

class Declaration(db.Model):
    __tablename__ = 'declarations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    categoria_texto = db.Column(db.String(100), nullable=False)
    fuente = db.Column(db.String(100), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    player = db.relationship('Player', backref='declarations')
    user = db.relationship('User', backref='declarations')
    
    def to_dict(self):
        return {
            "id": self.id,
            "player_id": self.player_id,
            "user_id": self.user_id,
            "categoria_texto": self.categoria_texto,
            "fuente": self.fuente,
            "texto": self.texto,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }