from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class RiskLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Assignment(BaseModel):
    name: str
    due: str
    risk: RiskLevel
    weight: Optional[float] = None  # grade percentage e.g. 26.67
    course: str = ""               # course code e.g. "EGN 2440"


class Contact(BaseModel):
    name: str
    role: str        # Professor, TA, etc.
    email: str = ""
    office_hours: str = ""


class UploadResponse(BaseModel):
    assignments: List[Assignment]
    contacts: List[Contact] = []
