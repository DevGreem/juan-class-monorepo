from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

from src.database.enums import TreatmentType, TreatmentStatus


class TreatmentResponse(BaseModel):
    id: str
    patient_id: str
    diagnostic_id: Optional[str] = None
    consultation_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    treatment_type: TreatmentType
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: TreatmentStatus
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
