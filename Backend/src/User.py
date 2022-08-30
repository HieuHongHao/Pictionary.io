class User:
    def __init__(
        self,
        username,
        room,
        score=0,
        role="Guesser",
        is_drawer=False,
        authority="Player",
    ):
        self.username = username
        self.score = score
        self.role = role
        self.is_drawer = is_drawer
        self.authority = authority
        self.room = room

    def __str__(self):
        return f"User {self.username} is playing and has a score of {self.score}"

    def format(self):
        return {
            "username": self.username,
            "score": self.score,
            "role": self.role,
            "is_drawer": self.is_drawer,
            "authority": self.authority,
            "room": self.room,
        }
