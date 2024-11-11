from datetime import datetime

from fastapi_users import schemas


class UserRead(schemas.BaseUser[int]):
    username: str
    rating: int
    registered_at: datetime



    class Config:
        from_attributes = True


class UserCreate(schemas.BaseUserCreate):
    username: str

class UserUpdate(schemas.BaseUserUpdate):
    username: str