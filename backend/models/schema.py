from pydantic import BaseModel
from typing import List
from enum import Enum


class RiskLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Assignment(BaseModel):
    name: str
    due: str
    risk: RiskLevel


class UploadResponse(BaseModel):
    assignments: List[Assignment]
