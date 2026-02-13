from fastapi import Response, HTTPException, Request
from pydantic import BaseModel
from src.database import SupabaseClient
from src.database.classes import LoginResponse
from src.utils import generate_otp, store_otp, send_otp_email
from . import AUTH_ROUTER

class LoginRequest(BaseModel):
    email: str
    password: str

@AUTH_ROUTER.post('/login')
def login(data: LoginRequest, request: Request, response: Response) -> LoginResponse:
    """Paso 1 del login: verifica credenciales y envía código OTP al correo.

    # Args:
        data (LoginRequest): User Credentials (email + password)
        response (Response): API Response
    
    # Returns:
        LoginResponse: requires_verification=True si las credenciales son válidas
    """
    
    try:
        # Verificar credenciales con Supabase
        result = SupabaseClient.sign_in({
            "email": data.email,
            "password": data.password,
        })
        
        # Generar y almacenar código OTP
        code = generate_otp()
        store_otp(
            user_id=result.user_id,
            email=result.email,
            code=code,
            access_token=result.access_token
        )
        
        # Enviar código por correo
        send_otp_email(
            to_email=result.email,
            code=code
        )
        
        return LoginResponse(
            success=True,
            requires_verification=True,
            user_id=result.user_id,
            message="Código de verificación enviado a tu correo electrónico"
        )
        
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )