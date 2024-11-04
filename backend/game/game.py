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
current_user = fastapi_users.current_user( optional=True)

@router.post("/create_game_session")
def create_game_session(user: User = Depends(current_user)):
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    session_id = secrets.token_hex(nbytes=8)
    if user:
        redis.set(session_id,
                  str({
                      "player_1": user.id,
                      "player_2": secrets.token_hex(nbytes=8),
                      "name_player_1": user.username,
                      "name_player_2": "Anonym",
                      "turnsX": [],
                      "turnsO": [],
                      "created_at": datetime.datetime.utcnow()
                  }))
    else:
        redis.set(session_id,
                  str({
                      "player_1": secrets.token_hex(nbytes=8),
                      "player_2": secrets.token_hex(nbytes=8),
                      "name_player_1": "Anonym",
                      "name_player_2": "Anonym",
                      "turnsX": [],
                      "turnsO": [],
                      "created_at": datetime.datetime.utcnow()
                  }))
    redis.close()
    return session_id

@router.post("/connect_game_session/{session_id}")
def create_game_session(session_id: str, user: User = Depends(current_user)):
    if user:
        redis = redis_lib.Redis(host='localhost', port=6379, db=0)
        session_data = redis.get(session_id).decode("utf-8")
        session_data = eval(session_data)
        session_data["player_2"] = user.id
        session_data["name_player_2"] = user.username
        redis.set(session_id,str(session_data))
        redis.close()
    return {"detail": "Success"}


@router.websocket("/game_session/{session_id}/{player_num}")
async def websocket_game_endpoint(websocket: WebSocket, session_id: str, player_num: str):
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    session_data = redis.get(session_id).decode("utf-8")
    session_data = eval(session_data)
    redis.close()
    await websocket.accept()
    if session_id not in WS_sessions:
        WS_sessions[session_id] = dict()
    WS_sessions[session_id][session_data[f"player_{player_num}"]] = websocket
    for connection in WS_sessions[session_id]:
        await WS_sessions[session_id][connection].send_text(f"{session_data[f'name_player_{player_num}']} has conected")
    try:
        while True:
            data = await websocket.receive_text()
            if WS_sessions[session_id][session_data["player_1"]] == websocket:
                await WS_sessions[session_id][session_data["player_2"]].send_text(f"Message text from {session_data['name_player_1']}: {data}")
            else:
                await WS_sessions[session_id][session_data["player_1"]].send_text(f"Message text from {session_data['name_player_2']}: {data}")
    except WebSocketDisconnect:
        del WS_sessions[session_id][session_data[f"player_{player_num}"]]
        if not WS_sessions[session_id]:
            del WS_sessions[session_id]
        else:
            for connection in WS_sessions[session_id]:
                await WS_sessions[session_id][connection].send_text(f"{session_data[f'name_player_{player_num}']} has disconected")

