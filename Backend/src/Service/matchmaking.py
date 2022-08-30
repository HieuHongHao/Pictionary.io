import boto3
import os
import redis
from uuid import uuid4
from dotenv import load_dotenv


load_dotenv()
client = boto3.client(
    "gamelift",
    region_name=os.getenv("AWS_DEFAULT_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

STREAM_KEY = "CREATE_MATCHES"



def start_matchmaking(config_name, player_id, score):
    client.start_matchmaking(
        ConfigurationName=config_name,
        Players=[
            {
                "PlayerAttributes": {"score": {"N": score}},
                "PlayerId": player_id,
                "Team": "four-players",
            }
        ],
        TicketId=str(uuid4()),
    )

if __name__ == "__main__":
    r = redis.Redis(decode_responses=True)
    last_job_id = 0
    matches = []
    while True:
        matches = r.xread(
            streams={STREAM_KEY: last_job_id},
            count=4,
        )
        if len(matches) > 0:
            players = matches[0][1]
            last_job_id = players[-1][0]
            print(players)
            message_id = []
            for player in players:
                start_matchmaking(
                    "matchmakingconfig-v1",
                    player_id=player[1]["playerId"],
                    score=int(player[1]["score"]),
                )
                message_id.append(player[0])
            r.xdel(STREAM_KEY, *message_id)
            print(matches)
