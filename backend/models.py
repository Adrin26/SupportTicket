from datetime import datetime, timezone,timedelta
from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

UTC8 = timezone(timedelta(hours=8))
def get_utc_now():
    return datetime.now(UTC8)

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False)  # "Low", "Medium", "High"
    status = Column(String(20), nullable=False, default="Open")  # "Open", "In Progress", "Resolved"
    requesterName = Column(String(100), nullable=False)
    createdAt = Column(DateTime, default=get_utc_now, nullable=False)
    updatedAt = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    def __repr__(self):
        return f"<Ticket(id={self.id}, title='{self.title}', status='{self.status}', priority='{self.priority}')>"
