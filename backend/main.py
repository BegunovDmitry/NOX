from datetime import datetime

from fastapi_users import FastAPIUsers

from fastapi import FastAPI, Depends

from fastapi.middleware.cors import CORSMiddleware

from auth.auth import auth_backend
from auth.database import User
from auth.manager import get_user_manager
from auth.schemas import UserRead, UserCreate, UserUpdate

from config import settings
from sqlalchemy import create_engine, select, desc
from sqlalchemy.sql import or_
from sqlalchemy.orm import Session
from database.models import GameSQL
from database.schemas import Game as GamePY

from game.game import router as game_router
from game.game_handler import router as game_handler_router


app = FastAPI(
    title="NOX"
)

DATABASE_URL = f"postgresql+psycopg2://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
engine = create_engine(DATABASE_URL)

########## CORS ##########

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=["Content-Type", "Cookie", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
                   "Authorization"],
    expose_headers=["Content-Type", "Cookie", "Set-Cookie"]
)


########## Auth routers ##########

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/cookie",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


########## Game routers ##########

app.include_router(game_router, tags=["game"])
app.include_router(game_handler_router, tags=["game"])


current_user = fastapi_users.current_user()

@app.get("/get_authorised_user_data")
def get_authorised_user_data(user: User = Depends(current_user)):
    return user


@app.get("/get_all_user_games")
def get_all_user_games(user: User = Depends(current_user)):
    with Session(bind=engine) as db_session:
        stmt = select(GameSQL).where(or_(GameSQL.player_1_id == user.id, GameSQL.player_2_id == user.id)).order_by(desc(GameSQL.created_at))
        res = []
        for game in db_session.execute(stmt).scalars():
            game = dict(GamePY.model_validate(game.__dict__))
            game["created_at"] = datetime.strftime(game["created_at"], '%d-%m-%Y %H:%M:%S')
            res.append(game)
    return res