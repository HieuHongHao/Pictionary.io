from uuid import uuid4
import boto3
import json
import os
import redis
from collections import deque
from dotenv import load_dotenv

load_dotenv()
STREAM_KEY_1 = "RECEIVE_MATCHES"

sqs = boto3.client(
    "sqs",
    region_name=os.getenv("AWS_DEFAULT_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)
r = redis.Redis(decode_responses=True)
receipt_handles = deque()



try:
    while True:
        response = sqs.receive_message(
            QueueUrl=os.getenv("QUEUE_URL"), MaxNumberOfMessages=10,
            WaitTimeSeconds=10
        )
        entries = []
        if "Messages" in response:
            for message in response["Messages"]:
                receipt_handles.append(message["ReceiptHandle"])
                data = json.loads(message["Body"])
                match_event = json.loads(data["Message"])
            if match_event["detail"]["type"] == "MatchmakingSucceeded":
                match = {"matchId": ""}
                players = match_event["detail"]["gameSessionInfo"]["players"]
                for idx, player in enumerate(players):
                    match[f"player-{idx + 1}"] = player["playerId"]
                match["matchId"] = match_event["detail"]["matchId"]
                print(match)
                r.xadd(STREAM_KEY_1, match)
            while receipt_handles:
                entries.append(
                    {"Id": str(uuid4()), "ReceiptHandle": receipt_handles.popleft()}
                )
            sqs.delete_message_batch(QueueUrl=os.getenv("QUEUE_URL"), Entries=entries)
except Exception as e:
    raise e
