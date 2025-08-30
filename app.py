import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Inicializamos la base de datos
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Configuración de la base de datos (ajusta con tus variables de entorno en Render)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///default.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # Importar y registrar tus blueprints aquí
    # from routes.user_routes import user_bp
    # app.register_blueprint(user_bp, url_prefix="/users")

    @app.route("/")
    def index():
        return {"message": "Backend Flask corriendo en Render 🚀"}

    return app


def initialize_database(app):
    with app.app_context():
        db.create_all()


# 👇 Esto es lo que Render (con Gunicorn) necesita:
app = create_app()
initialize_database(app)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Render asigna el puerto en PORT
    app.run(host="0.0.0.0", port=port, debug=False)
