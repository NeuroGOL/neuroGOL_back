from extensions import db, bcrypt, jwt

def register_extensions(app):
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
