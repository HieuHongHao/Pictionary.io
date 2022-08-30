from flask import Blueprint
from room import room
from auth import auth
from match import match

main_route = Blueprint("main", __name__, url_prefix="/api/v1")
main_route.register_blueprint(auth)
main_route.register_blueprint(room)
main_route.register_blueprint(match)