from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from src.database.enums import ConsultationStatus


class ConsultationResponse(BaseModel):
    id: str
    patient_id: str
    consultation_date: Optional[datetime] = None
    reason: str
    symptoms: Optional[str] = None
    notes: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    temperature_c: Optional[float] = None
    status: ConsultationStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
