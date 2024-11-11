from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, ARRAY, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class UserSQL(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    username = Column(String, nullable=False)
    rating = Column(Integer, default=1000)
    registered_at = Column(TIMESTAMP, default=datetime.utcnow)
    hashed_password: str = Column(String(length=1024), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_superuser: bool = Column(Boolean, default=False, nullable=False)
    is_verified: bool = Column(Boolean, default=False, nullable=False)

class GameSQL(Base):
    __tablename__ = "game"
    id = Column(Integer, primary_key=True)
    player_1_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    player_2_id = Column(Integer, ForeignKey("user.id"))
    turnsX = Column(ARRAY(String))
    turnsO = Column(ARRAY(String))
    winner = Column(Integer)


