from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

from src.database.enums import Severity, DiagnosisType


class DiagnosticResponse(BaseModel):
    id: str
    patient_id: str
    consultation_id: Optional[str] = None
    code: Optional[str] = None
    name: str
    description: Optional[str] = None
    severity: Severity
    diagnosis_type: DiagnosisType
    diagnosis_date: Optional[date] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
