from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from database import User, Room

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True 


class RoomSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Room
        include_relationships = True
        load_instance = True 

