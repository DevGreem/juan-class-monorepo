from pydantic import BaseModel
from typing import Optional


class UpdateUserRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
