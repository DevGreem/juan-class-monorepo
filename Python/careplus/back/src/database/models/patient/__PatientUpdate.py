from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

from src.database.enums import Gender, DocumentType, BloodType


class PatientUpdate(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    document_type: Optional[DocumentType] = None
    document_number: Optional[str] = Field(None, max_length=30)
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    blood_type: Optional[BloodType] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    is_active: Optional[bool] = None
