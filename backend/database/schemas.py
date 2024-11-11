from pydantic import BaseModel

class Game(BaseModel):
    id: int
    player_1_id: int
    player_2_id: int | None = None
    turnsX: list
    turnsO: list
    winner: int | None = None