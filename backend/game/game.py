from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException

import redis as redis_lib


WS_sessions = dict()

router = APIRouter(prefix="/game")


@router.websocket("/game_session/{session_id}/{player_num}")
async def websocket_game_endpoint(websocket: WebSocket, session_id: str, player_num: str):
    redis = redis_lib.Redis(host='localhost', port=6379, db=0)
    try:
        session_data = redis.get(session_id).decode("utf-8")
    except:
        redis.close()
        raise HTTPException(status_code=404)
    session_data = eval(session_data)
    redis.close()
    await websocket.accept()
    if session_id not in WS_sessions:
        WS_sessions[session_id] = dict()
    WS_sessions[session_id][session_data[f"player_{player_num}"]] = websocket
    for connection in WS_sessions[session_id]:
        await WS_sessions[session_id][connection].send_text(f"connect {player_num}")
    try:
        while True:
            data = await websocket.receive_text()

            if WS_sessions[session_id][session_data["player_1"]] == websocket:
                redis = redis_lib.Redis(host='localhost', port=6379, db=0)
                changing_data = redis.get(session_id).decode("utf-8")
                changing_data = eval(changing_data)
                changing_data[f"turns{changing_data['sign_player1']}"] = changing_data[f"turns{changing_data['sign_player1']}"] + [data]
                redis.set(session_id, str(changing_data))
                redis.close()
                await WS_sessions[session_id][session_data["player_2"]].send_text({data})
                print(changing_data)

            else:
                redis = redis_lib.Redis(host='localhost', port=6379, db=0)
                changing_data = redis.get(session_id).decode("utf-8")
                changing_data = eval(changing_data)
                changing_data[f"turns{changing_data['sign_player2']}"] = changing_data[f"turns{changing_data['sign_player2']}"] + [data]
                redis.set(session_id, str(changing_data))
                redis.close()
                await WS_sessions[session_id][session_data["player_1"]].send_text(data)
                print(changing_data)

    except WebSocketDisconnect:
        del WS_sessions[session_id][session_data[f"player_{player_num}"]]
        if not WS_sessions[session_id]:
            del WS_sessions[session_id]
        else:
            for connection in WS_sessions[session_id]:
                await WS_sessions[session_id][connection].send_text(f"disconnect {player_num}")

