import datetime
from extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False, default=2)
    profile_picture = db.Column(db.String(), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
