from datetime import datetime
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


user_room = db.Table(
    "user_room",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("room_id", db.Integer, db.ForeignKey("room.id")),
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, default=datetime.now())
    inRoom = db.relationship("Room", secondary=user_room, backref="users")
    score = db.Column(db.Integer, default=0)
    def format_json(self):
        return {
            "username": self.username,
            "password": self.password,
            "email": self.email,
        }


class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    score_board = db.relationship("Score", backref="room")
    word_list = db.relationship("Word", backref="room")
    owner = db.Column(db.String(20), unique=True)


class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, default=0)
    username = db.Column(db.String(80), unique=True, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"))


class Word(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(30), unique=True, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"))
