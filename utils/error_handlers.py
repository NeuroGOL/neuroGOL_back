from flask import jsonify

class APIError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

def register_error_handlers(app):
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = {
            "error": error.message,
            "status": "error"
        }
        return jsonify(response), error.status_code

    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({"error": "Ruta no encontrada", "status": "error"}), 404

    @app.errorhandler(500)
    def handle_server_error(error):
        return jsonify({"error": "Error interno del servidor", "status": "error"}), 500
