from extensions import db
from seeders.role_seeder import seed_roles
from sqlalchemy import inspect

# ✅ Importa todos tus modelos
from models.declaration_model import Declaration
from models.nlp_analysis_model import NLPAnalysis
from models.player_model import Player
from models.report_model import Report
from models.role_model import Role
from models.user_model import User


def initialize_database(app):
    with app.app_context():
        inspector = inspect(db.engine)
        existing_tables = inspector.get_table_names()

        if not existing_tables:
            db.create_all()
            seed_roles()
            db.session.commit()
            print("✅ Base de datos creada e inicializada correctamente con todos los modelos")
        else:
            print("ℹ️ Las tablas ya existen, no se recrearán.")
