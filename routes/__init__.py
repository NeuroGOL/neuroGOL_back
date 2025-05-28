from .auth_routes import auth_bp
from .user_routes import user_bp
from .role_routes import role_bp
from .nlp_analysis_routes import nlp_analysis_bp
from .declaration_routes import declaration_bp
from .player_routes import player_bp
from .report_routes import report_bp

__all__ = [
    "auth_bp",
    "user_bp",
    "role_bp",
    "nlp_analysis_bp",
    "declaration_bp",
    "player_bp",
    "report_bp"
]
