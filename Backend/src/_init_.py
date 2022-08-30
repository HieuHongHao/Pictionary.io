import eventlet
eventlet.monkey_patch()
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from mainRoute import main_route
from database import db
from dotenv import load_dotenv
import os

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.secret_key = "shrekduc124sgjjksgjrkjsjk"
    app.config["FLASK"] = os.getenv("FLASK")
    app.config["FLASK_APP"] = os.getenv("FLASK_APP")
    app.config["FLASK_ENV"] = os.getenv("FLASK_ENV")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
    app.config["SECRET"] = os.getenv("SECRET")
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.register_blueprint(main_route)
    CORS(app, supports_credentials=True)
    db.init_app(app)
    Migrate(app, db)
    with app.app_context():
        db.create_all()
    return app
