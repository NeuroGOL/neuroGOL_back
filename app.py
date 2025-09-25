import os
from flask import Flask, request
from flask_cors import CORS
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

    # ✅ Configuración de CORS para dev y prod
    CORS(
        app,
        resources={r"/*": {"origins": [
            "http://localhost:4200",
            "https://neuro-gol.netlify.app"
        ]}},
        supports_credentials=True
    )

    # ✅ Registro de extensiones, rutas y errores
    register_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)

    # ✅ Headers extra solo si el origin está permitido
    @app.after_request
    def apply_cors_headers(response):
        origin = request.headers.get("Origin")
        allowed = [
            "http://localhost:4200",
            "https://neuro-gol.netlify.app"
        ]
        if origin in allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        return response

    @app.route("/")
    def index():
        return {"message": "NeuroGOL backend funcionando 🚀"}

    return app


app = create_app()
initialize_database(app)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
