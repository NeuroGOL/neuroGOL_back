from extensions import db
from seeders.role_seeder import seed_roles

def initialize_database(app):
    with app.app_context():
        db.create_all()     # ✅ usa la instancia de extensions.py
        seed_roles()
        db.session.commit()
        print("✅ Base de datos inicializada correctamente")
