from functools import wraps
from flask import Blueprint, jsonify, request, session
from sqlalchemy import and_
from database import User, db
from schema import UserSchema


auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.post("register")
def register():
    content_type = request.headers.get("Content-type")
    username, password, email = "", "", ""
    if content_type == "application/json":
        username = request.json["username"]
        email = request.json["email"]
        password = request.json["password"]
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({"status": "Fail", "message": "User already exist"})
    user = User(username=username, password=password, email=email)
    user_schema = UserSchema()
    user_dump_data = user_schema.dump(user)
    session["user"] = user_dump_data
    db.session.add(user)
    db.session.commit()
    return jsonify({"data": user_dump_data, "status": "Success"})


@auth.post("login")
def login():
    username, password = "", ""
    content_type = request.headers.get("Content-type")
    if content_type == "application/json":
        username = request.json["username"]
        password = request.json["password"]
    if (
        "user" in session
        and session["user"]["username"] == username
        and session["password"] == password
    ):
        return jsonify(
            {"data": session["user"], "message": "Already login", "status": "Success"}
        )
    user = User.query.filter(
        and_(User.username == username, User.password == password)
    ).first()
    if user is None:
        return jsonify({"status": "Fail", "message": "user not found"})
    user_schema = UserSchema()
    user_dump_data = user_schema.dump(user)
    session["user"] = user_dump_data
    return jsonify({"user": user_dump_data, "status": "Success"})


def checkPassport(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers["Authorization"]
        if auth is None:
            return jsonify(
                {
                    "status": "Fail",
                    "message": "user not found, login or register account",
                }
            )
        if "user" not in session:
            session["user"] = UserSchema().dump(
                User.query.filter(User.username == auth).first()
            )
        return f()

    return wrapper
