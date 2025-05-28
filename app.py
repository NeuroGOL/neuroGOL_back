from flask import Flask
from flask_cors import CORS  # ⬅️ Importa CORS
from config import Config
from setup.register_extensions import register_extensions
from setup.register_blueprints import register_blueprints
from setup.init_database import initialize_database
from utils.error_handlers import register_error_handlers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Evita redirecciones que rompen CORS
    app.url_map.strict_slashes = False

    # ✅ Configuración segura de CORS para Angular en localhost
    CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

    # ✅ Registros de extensiones, rutas y errores
    register_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)

    # ✅ Refuerza CORS con headers manuales (opcional pero útil)
    @app.after_request
    def apply_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:4200"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    @app.route('/')
    def index():
        return {"message": "NeuroGOL backend funcionando"}

    return app

if __name__ == "__main__":
    app = create_app()
    initialize_database(app)
    app.run(debug=True, port=5000)
