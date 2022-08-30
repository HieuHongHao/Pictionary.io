from flask import Blueprint, jsonify, request, session
from database import Room, User, db
from auth import checkPassport
from schema import RoomSchema


room = Blueprint("room", __name__, url_prefix="/room")



@room.post("create")
@checkPassport
def create_room():
    username = session["user"]["username"]
    room_name = ""
    if request.headers.get("Content-type") == "application/json":
        room_name = request.json["name"]
    if Room.query.filter_by(name=room_name).first() is not None:
        return jsonify({"message": "room name already exists", "status": "Fail"})
    room = Room(name=room_name, owner=username)
    user = User.query.filter_by(username=username).first()
    if room in user.inRoom:
        return jsonify({"message": "user already in room", "status": "Fail"})
    user.inRoom.append(room)
    db.session.add(room)
    db.session.commit()
    room_dump_data = [
        RoomSchema().dump(user.inRoom[i]) for i in range(len(user.inRoom))
    ]
    return jsonify({"status": "Success", "rooms": room_dump_data})


@room.get("")
@checkPassport
def get_all_room():
    username = session["user"]["username"]
    user = User.query.filter_by(username=username).first()
    if len(user.inRoom) == 0:
        return jsonify({"status": "Success", "rooms": []})
    rooms_dump_data = [
        RoomSchema().dump(user.inRoom[i]) for i in range(len(user.inRoom))
    ]
    return jsonify({"status": "Success", "rooms": rooms_dump_data})


@room.post("/join")
@checkPassport
def join_room():
    username = session["user"]["username"]
    user = User.query.filter_by(username=username).first()
    if request.headers.get("Content-type") == "application/json":
        room_name = request.json["name"]
    room = Room.query.filter_by(name=room_name).first()
    room.users.append(user)
    db.session.commit()
    rooms_dump_data = RoomSchema().dump(room)
    return jsonify({"status": "Success", "room": rooms_dump_data})
