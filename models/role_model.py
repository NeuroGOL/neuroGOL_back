from extensions import db

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre
        }
