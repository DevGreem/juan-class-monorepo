from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

from src.database.enums import EventType


class MedicalHistoryResponse(BaseModel):
    id: str
    patient_id: str
    consultation_id: Optional[str] = None
    diagnostic_id: Optional[str] = None
    treatment_id: Optional[str] = None
    event_type: EventType
    title: str
    description: Optional[str] = None
    event_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
