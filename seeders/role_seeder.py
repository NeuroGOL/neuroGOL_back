from extensions import db
from models.role_model import Role

def seed_roles():
    roles = [
        {"id": 1, "nombre": "admin"},
        {"id": 2, "nombre": "analista"}
    ]

    for role_data in roles:
        existing = Role.query.get(role_data["id"])
        if not existing:
            new_role = Role(id=role_data["id"], nombre=role_data["nombre"])
            db.session.add(new_role)

    db.session.commit()
    print("✅ Roles sembrados correctamente")
