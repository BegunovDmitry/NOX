from fastapi import APIRouter, Depends

from fastapi_users import FastAPIUsers
from auth.auth import auth_backend
from auth.manager import get_user_manager
from auth.database import User

import redis as redis_lib

import secrets
import datetime
from random import randrange, choice

router = APIRouter(prefix="/game_handler")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)
current_user = fastapi_users.current_user( optional=True )

@router.get("/create_game_session")
def create_game_session():
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    session_id = secrets.token_hex(nbytes=8)
    start_user = randrange(1, 3)
    sign_player1 = choice(["X", "O"])
    if sign_player1 == "X":
        sign_player2 = "O"
    else:
        sign_player2 = "X"

    session_data = {
                      "player_1": "No",
                      "player_2": "No",
                      "name_player_1": "Anonym",
                      "name_player_2": "Anonym",
                      "start_user_num": start_user,
                      "sign_player1": sign_player1,
                      "sign_player2": sign_player2,
                      "turnsX": [],
                      "turnsO": [],
                      "created_at": datetime.datetime.utcnow()
                  }

    redis.set(session_id, str(session_data))
    redis.close()

    return {
        "session": session_id
    }


@router.get("/connect_game_session/{session_id}")
def connect_game_session(session_id: str, user: User = Depends(current_user)):

    redis = redis_lib.Redis(host='localhost', port=6379, db=0)

    try:
        session_data = redis.get(session_id).decode("utf-8")
    except:
        return {"status": "session not found"}

    session_data = eval(session_data)

    if session_data["player_1"] == "No":
        user_num = 1
    elif session_data["player_2"] == "No":
        user_num = 2
    else:
        return {
            "status": "All players already connected"
        }

    if user:
        session_data[f"player_{user_num}"] = user.id
        session_data[f"name_player_{user_num}"] = user.username
        redis.set(session_id,str(session_data))
    else:
        session_data[f"player_{user_num}"] = secrets.token_hex(nbytes=8)
        redis.set(session_id, str(session_data))

    redis.close()

    return {
        "status": "success",
        "player_num": user_num,
        "start_user": session_data["start_user_num"],
        "sign_player1": session_data["sign_player1"],
        "sign_player2": session_data["sign_player2"]
    }

@router.post("/end_game_session/{session_id}")
def end_game_session(session_id: str):

    redis = redis_lib.Redis(host='localhost', port=6379, db=0)

    try:
        session_data = redis.get(session_id).decode("utf-8")
    except:
        return {"status": "session not found"}

    session_data = eval(session_data)
    ######################################## put in db
    print(session_data)
    ###################################################

    redis.delete(session_id)
    redis.close()

    return({
        "status": "success",
        "session": session_id
    })