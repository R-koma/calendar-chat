from .auth_routes import auth_bp
from .user_routes import user_bp
from .friend_routes import friend_bp


def init_routes(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(friend_bp, url_prefix='/friend')
