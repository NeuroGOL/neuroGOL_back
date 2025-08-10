from routes import (
    auth_bp,
    user_bp,
    role_bp,
    nlp_analysis_bp,
    declaration_bp,
    player_bp,
    report_bp,
)

def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(role_bp)
    app.register_blueprint(nlp_analysis_bp)
    app.register_blueprint(declaration_bp)
    app.register_blueprint(player_bp)
    app.register_blueprint(report_bp)
