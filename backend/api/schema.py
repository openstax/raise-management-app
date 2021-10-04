from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .database import Base


class Study(Base):
    __tablename__ = "studies"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, nullable=False)
    configuration = Column(JSONB, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow,
                        onupdate=datetime.utcnow)
