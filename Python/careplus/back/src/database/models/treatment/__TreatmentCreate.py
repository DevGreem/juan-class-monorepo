from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import TreatmentType, TreatmentStatus


class TreatmentCreate(BaseModel):
    patient_id: str
    diagnostic_id: Optional[str] = None
    consultation_id: Optional[str] = None
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    treatment_type: TreatmentType = TreatmentType.medicamento
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: TreatmentStatus = TreatmentStatus.activo
