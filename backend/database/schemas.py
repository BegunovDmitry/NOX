from datetime import datetime

from pydantic import BaseModel

class Game(BaseModel):
    id: int
    player_1_id: int | None = None
    player_2_id: int | None = None
    player_1_name: str
    player_2_name: str
    turnsX: list
    turnsO: list
    winner: int | None = None
    created_at: datetime