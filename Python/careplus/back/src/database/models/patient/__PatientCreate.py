from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import Gender, DocumentType, BloodType


class PatientCreate(BaseModel):
    first_name: str = Field(..., max_length=100)
    last_name: str = Field(..., max_length=100)
    date_of_birth: date
    gender: Gender
    document_type: DocumentType = DocumentType.cedula
    document_number: str = Field(..., max_length=30)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    blood_type: Optional[BloodType] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
