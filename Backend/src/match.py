from flask import Blueprint, jsonify, request, session
from auth import checkPassport
import redis

r = redis.Redis(decode_responses=True)
match = Blueprint("match", __name__, url_prefix="/match")
STREAM_KEY = "CREATE_MATCHES"


@match.post("")
@checkPassport
def send_ticket():
    username = session["user"]["username"]
    score = None
    if request.headers.get('Content-type') == 'application/json':
        score = request.json["score"]
    if score is None:
        return jsonify({"message": "user's score not found", "status": "Fail"})
    match = {
        "playerId": username,
        "score": score
    }
    job_id = r.xadd(STREAM_KEY,match)
    print(job_id)
    return jsonify({"status": "Success", "message": "match requested sent"})
