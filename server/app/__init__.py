from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO


# from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="http://localhost:3003")
# csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    # csrf.init_app(app)
    CORS(app, supports_credentials=True, origins=["http://localhost:3003"])
    socketio.init_app(app)

    from app.routes import init_routes

    init_routes(app)

    return app
