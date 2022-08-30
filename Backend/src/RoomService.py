from flask_socketio import join_room, emit
from User import User


class RoomService:
    def __init__(self):
        self.participants = {}
        self.messages = []
        self.owner = ""
        self.room = ""

    def join(self, username, room, socket_id, authority):
        if authority == "Owner":
            self.owner = socket_id
        self.room = room
        new_player = User(username, room, authority=authority)
        self.participants[socket_id] = new_player
        join_room(self.room)
        emit("player-registered", new_player.format(), to=socket_id)
        emit(
            "new-player-joined",
            {"messages": [new_player.username for new_player in self.participants.values()]},
            to=self.room,
        )

    def send_message(self, message):
        self.messages.append(message)
        emit("message-from-server", message, to=self.room)

    def recv_message(self, messages):
        self.messages.append(messages)

    def start_drawing(self, drawing):
        emit("begin-drawing", drawing, to=self.room, include_self=False)

    def send_drawing(self, drawing):
        emit("drawing-from-server", drawing, to=self.room, include_self=False)

    def stop_drawing(self):
        emit("cancel-drawing", to=self.room, include_self=False)
    
    def assign_role(self):
        assigned_drawer = False
        if all(self.participants[socket].is_drawer for socket in self.participants):
            for socket in self.participants:
                self.participants[socket].is_drawer = False
                self.participants[socket].role = "Guesser"
        for socket in self.participants:
            if (not self.participants[socket].is_drawer) and (not assigned_drawer):
                self.participants[socket].role = "Drawer"
                self.participants[socket].is_drawer = True
                assigned_drawer = True
            else:
                self.participants[socket].role = "Guesser"
        emit(
            "assign-role",
            {
                "players": [
                    self.participants[socket].format() for socket in self.participants
                ]
            },
            to=self.room,
        )
    def generate_word(self):
        emit("word-generated", {"word": "Andrew Tate"}, to=self.room)

    def __str__(self):
        return f"{self.room} has players: {[self.participants[socket].username for socket in self.participants]}"

    def delete_player(self, socket_id):
        if socket_id in self.participants:
            self.participants.pop(socket_id)
