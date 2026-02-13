from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from src.database.enums import ConsultationStatus


class ConsultationUpdate(BaseModel):
    consultation_date: Optional[datetime] = None
    reason: Optional[str] = None
    symptoms: Optional[str] = None
    notes: Optional[str] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    temperature_c: Optional[float] = None
    status: Optional[ConsultationStatus] = None
