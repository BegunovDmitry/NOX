from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from fastapi_users import FastAPIUsers
from auth.auth import auth_backend
from auth.manager import get_user_manager
from auth.database import User

import redis as redis_lib

import secrets
import datetime

WS_sessions = dict()


router = APIRouter(prefix="/game")

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)
current_user = fastapi_users.current_user()

@router.post("/create_game_session")
def create_game_session(user: User = Depends(current_user)):
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    session_key = secrets.token_hex(nbytes=8)
    redis.set(session_key,
              str({
                  "player_1": secrets.token_hex(nbytes=8),
                  "player_2": secrets.token_hex(nbytes=8),
                  "turnsX": [],
                  "turnsO": [],
                  "created_at": datetime.datetime.utcnow()
              }))
    return session_key

@router.websocket("/game_session/{game_id}/{player_num}")
async def websocket_game_endpoint(websocket: WebSocket, game_id: str, player_num: str):
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    session_data = redis.get(game_id).decode("utf-8")
    session_data = eval(session_data)
    redis.close()
    await websocket.accept()
    WS_sessions[session_data[f"player_{player_num}"]] = websocket
    try:
        while True:
            data = await websocket.receive_text()
            if WS_sessions[session_data["player_1"]] == websocket:
                await WS_sessions[session_data["player_2"]].send_text(f"Message text from player 1: {data}")
            else:
                await WS_sessions[session_data["player_1"]].send_text(f"Message text from player 2: {data}")
    except WebSocketDisconnect:
        del WS_sessions[session_data[f"player_{player_num}"]]
        for connection in WS_sessions:
            await WS_sessions[connection].send_text(f"Player {player_num} has disconected")

