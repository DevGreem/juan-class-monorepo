from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import TreatmentType, TreatmentStatus


class TreatmentUpdate(BaseModel):
    diagnostic_id: Optional[str] = None
    consultation_id: Optional[str] = None
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    treatment_type: Optional[TreatmentType] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[TreatmentStatus] = None
