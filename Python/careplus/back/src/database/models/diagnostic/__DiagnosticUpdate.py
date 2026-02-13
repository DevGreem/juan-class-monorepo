from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import Severity, DiagnosisType


class DiagnosticUpdate(BaseModel):
    consultation_id: Optional[str] = None
    code: Optional[str] = None
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    severity: Optional[Severity] = None
    diagnosis_type: Optional[DiagnosisType] = None
    diagnosis_date: Optional[date] = None
