from pydantic import BaseModel
from typing import Optional


class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str  # 'medico', 'admin', etc.
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
