from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class UserSQL(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(100), nullable=False)
    email = Column(String(100), default="No email")
    password = Column(String(100), nullable=False)
    registered_at = Column(DateTime, default=datetime.utcnow)