from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user_model import User
from .role_model import Role
from .player_model import Player
from .declaration_model import Declaration
from .nlp_analysis_model import NLPAnalysis
from .report_model import Report
