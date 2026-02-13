from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import Severity, DiagnosisType


class DiagnosticCreate(BaseModel):
    patient_id: str
    consultation_id: Optional[str] = None
    code: Optional[str] = None
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    severity: Severity = Severity.moderado
    diagnosis_type: DiagnosisType = DiagnosisType.definitivo
    diagnosis_date: Optional[date] = None
