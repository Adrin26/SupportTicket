from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator


class PriorityEnum(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class StatusEnum(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"


class TicketBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150, description="Title of the support ticket")
    description: str = Field(..., min_length=1, description="Detailed description of the issue")
    priority: PriorityEnum = Field(..., description="Ticket priority level (Low, Medium, High)")
    requesterName: str = Field(..., min_length=1, max_length=100, description="Name or identifier of the requester")

    @field_validator("title", "requesterName", "description")
    @classmethod
    def strip_and_validate_non_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Field cannot be empty or just whitespace.")
        return stripped


class TicketCreate(TicketBase):
    status: Optional[StatusEnum] = Field(default=StatusEnum.OPEN, description="Initial ticket status")


class TicketUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=150)
    description: Optional[str] = Field(default=None, min_length=1)
    priority: Optional[PriorityEnum] = Field(default=None)
    status: Optional[StatusEnum] = Field(default=None)
    requesterName: Optional[str] = Field(default=None, min_length=1, max_length=100)

    @field_validator("title", "requesterName", "description")
    @classmethod
    def strip_and_validate_optional(cls, value: Optional[str]) -> Optional[str]:
        if value is not None:
            stripped = value.strip()
            if not stripped:
                raise ValueError("Field cannot be empty or just whitespace.")
            return stripped
        return value


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    priority: PriorityEnum
    status: StatusEnum
    requesterName: str
    createdAt: datetime
    updatedAt: datetime

    model_config = ConfigDict(from_attributes=True)
