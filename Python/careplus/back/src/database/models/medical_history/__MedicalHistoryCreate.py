from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import EventType


class MedicalHistoryCreate(BaseModel):
    patient_id: str
    consultation_id: Optional[str] = None
    diagnostic_id: Optional[str] = None
    treatment_id: Optional[str] = None
    event_type: EventType
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    event_date: Optional[date] = None
