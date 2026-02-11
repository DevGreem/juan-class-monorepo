from pydantic import BaseModel
from typing import Optional

class LoginResponse(BaseModel):
    token: Optional[str] = None
    success: bool