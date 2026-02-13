from pydantic import BaseModel
from typing import Optional


class SignUpResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None
