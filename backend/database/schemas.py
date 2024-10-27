from pydantic import BaseModel
from datetime import datetime


class BaseUser(BaseModel):
    id: int
    username: str
    email: str
    registered_at: datetime

class ViewUser(BaseUser):
    pass

class FullUser(BaseUser):
    password: str