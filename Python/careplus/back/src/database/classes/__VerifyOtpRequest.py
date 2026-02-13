from pydantic import BaseModel

class VerifyOtpRequest(BaseModel):
    user_id: str
    code: str
