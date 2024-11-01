
from fastapi_users import FastAPIUsers

from fastapi import FastAPI, Depends

from fastapi.middleware.cors import CORSMiddleware

from auth.auth import auth_backend
from auth.database import User
from auth.manager import get_user_manager
from auth.schemas import UserRead, UserCreate, UserUpdate

from game.game import router as game_router


app = FastAPI(
    title="NOX"
)


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


current_user = fastapi_users.current_user()

@app.get("/get_authorised_user_data")
def get_authorised_user_data(user: User = Depends(current_user)):
    return user


@app.get("/unprotected-route", dependencies=[Depends(current_user)])
def unprotected_route():
    return f"Hello, anonym"