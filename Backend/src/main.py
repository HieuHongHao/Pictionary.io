from _init_ import create_app
from flask_socketio import SocketIO, emit
from RoomService import RoomService
from flask import request
import redis

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = {}
tickets = {}
r = redis.Redis(decode_responses=True)
STREAM_KEY = "RECEIVE_MATCHES"


@socketio.on("join-room")
def join(json):
    user_name = json["username"]
    room_id = json["room"]
    authority = json["authority"]
    if room_id not in rooms:
        rooms[room_id] = RoomService()
    rooms[room_id].join(user_name, room_id, request.sid, authority)
    


@socketio.on("incomming-message")
def message_handler(json):
    room_id = json["room"]
    rooms[room_id].send_message(json["message"])


@socketio.on("incomming-drawing")
def drawing_handler(json):
    room_id = json["room"]
    rooms[room_id].send_drawing(json)


@socketio.on("start-drawing")
def start_drawing_handler(json):
    room_id = json["room"]
    rooms[room_id].start_drawing(json)


@socketio.on("stop-drawing")
def stop_drawing_handler(json):
    room_id = json["room"]
    rooms[room_id].stop_drawing()


@socketio.on("assign")
def assign(json):
    room_id = json["room"]
    rooms[room_id].assign_role()


@socketio.on("disconnect")
def disconnect_player():
    for room_id in rooms:
        rooms[room_id].delete_player(request.sid)


@socketio.on("check-matches")
def check_matches(json):
    user_name = json["username"]
    response = {"status": "No ticket found", "ticket": "", "owner": ""}
    if user_name in tickets:
        print(tickets[user_name])
        response["status"] = "Ticket found"
        response["ticket"] = tickets[user_name]
        print(response)
        emit(
            "match-status",
            response,
            to=request.sid,
        )
    else:
        matches = None
        last_match_id = 0
        matches = r.xread(
            streams={
                STREAM_KEY: last_match_id,
            },
            count=1,
        )
        if len(matches) > 0:
            message_id = matches[0][1][0][0]
            game_session = matches[0][1][0][1]
            for i in range(1, 5):
                if game_session[f"player-{i}"] == user_name:
                    response["ticket"] = game_session["matchId"]
                    response["status"] = "Ticket found"
                    response["owner"] = user_name
                tickets[game_session[f"player-{i}"]] = game_session["matchId"]
            r.xdel(STREAM_KEY, message_id)
        emit("match-status", response, to=request.sid)


if __name__ == "__main__":
    socketio.run(app, debug=True)
