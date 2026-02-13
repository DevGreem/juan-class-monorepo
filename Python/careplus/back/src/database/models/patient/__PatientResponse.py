from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

from src.database.enums import Gender, DocumentType


class PatientResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    document_type: DocumentType
    document_number: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True
