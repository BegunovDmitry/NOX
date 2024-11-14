from fastapi import APIRouter, Depends

from fastapi_users import FastAPIUsers
from auth.auth import auth_backend
from auth.manager import get_user_manager
from auth.database import User, engine

import redis as redis_lib

from config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from database.models import GameSQL, UserSQL

import secrets
import datetime
from random import randrange, choice

router = APIRouter(prefix="/game_handler")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)
current_user = fastapi_users.current_user( optional=True )

DATABASE_URL = f"postgresql+psycopg2://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)

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
                      "rating_player_1": None,
                      "rating_player_2": None,
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
        opponent_num = 2
    elif session_data["player_2"] == "No":
        user_num = 2
        opponent_num = 1
    else:
        return {
            "status": "All players already connected"
        }

    if user:
        session_data[f"player_{user_num}"] = user.id
        session_data[f"name_player_{user_num}"] = user.username
        session_data[f"rating_player_{user_num}"] = user.rating
        redis.set(session_id,str(session_data))
    else:
        session_data[f"player_{user_num}"] = secrets.token_hex(nbytes=8)
        redis.set(session_id, str(session_data))

    redis.close()

    return {
        "status": "success",
        "player_num": user_num,
        "opponent_num": opponent_num,
        "start_user": session_data["start_user_num"],
        "sign_player1": session_data["sign_player1"],
        "sign_player2": session_data["sign_player2"]
    }

@router.post("/end_game_session/{session_id}/{winner_num}")
def end_game_session(session_id: str, winner_num: int):

    redis = redis_lib.Redis(host='localhost', port=6379, db=0)

    try:
        session_data = redis.get(session_id).decode("utf-8")
    except:
        redis.close()
        return {"status": "session not found"}
    redis.close()

    session_data = eval(session_data)
    ########################################  db work

    if (type(session_data["player_1"]) == int or type(session_data["player_2"]) == int):
        with Session(bind=engine) as db_session:
            finished_game = GameSQL(
                player_1_id = (session_data["player_1"] if type(session_data["player_1"]) == int else None),
                player_2_id = (session_data["player_2"] if type(session_data["player_2"]) == int else None),
                player_1_name = session_data["name_player_1"],
                player_2_name = session_data["name_player_2"],
                turnsX = session_data["turnsX"],
                turnsO = session_data["turnsO"],
                winner = (winner_num if winner_num != 0 else None)
            )
            db_session.add(finished_game)

            # rating handler
            if type(session_data["player_1"]) == int:
                if (winner_num != 0):
                    player_1 = db_session.query(UserSQL).get(session_data["player_1"])
                    if winner_num == 1:
                        player_1.rating += 30
                    else:
                        player_1.rating -= 30
                    db_session.add(player_1)
            if type(session_data["player_2"]) == int:
                if (winner_num != 0):
                    player_2 = db_session.query(UserSQL).get(session_data["player_2"])
                    if winner_num == 2:
                        player_2.rating += 30
                    else:
                        player_2.rating -= 30
                    db_session.add(player_2)

            db_session.commit()

    ###################################################

    return({
        "status": "success",
        "session": session_id
    })


@router.delete("/delete_game_session/{session_id}")
def delete_game_session(session_id: str):

    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    print("EXXXXIT")
    print(redis.get(session_id))
    redis.delete(session_id)
    redis.close()

    return({
        "status": "deleted",
        "session": session_id
    })