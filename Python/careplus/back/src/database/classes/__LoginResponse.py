from pydantic import BaseModel
from typing import Optional

class LoginResponse(BaseModel):
    token: Optional[str] = None
    refresh_token: Optional[str] = None
    success: bool
    requires_verification: bool = False
    user_id: Optional[str] = None
    message: Optional[str] = None