from fastapi import HTTPException
from pydantic import BaseModel
from src.database import SupabaseClient
from src.database.classes import LoginResponse
from . import AUTH_ROUTER

class SignUpRequest(BaseModel):
    email: str
    password: str

@AUTH_ROUTER.post('/sign_up')
def sign_up(data: SignUpRequest) -> LoginResponse:
    """Registra un nuevo usuario. Si la confirmación por email está activada
    en Supabase, retorna un mensaje indicando que debe confirmar su correo.

    # Args:
        data (SignUpRequest): User Credentials (email + password)
    """
    
    try:
        result = SupabaseClient.sign_up({
            "email": data.email,
            "password": data.password,
        })
        
        if result.needs_confirmation:
            return LoginResponse(
                success=True,
                requires_verification=True,
                message="Cuenta creada. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
            )
        
        return LoginResponse(
            token=result.access_token,
            success=True,
            message="Cuenta creada exitosamente"
        )
    except Exception as e:
        detail = str(e)
        if "already registered" in detail.lower() or "already been registered" in detail.lower():
            raise HTTPException(
                status_code=409,
                detail="Este correo ya está registrado. Intenta iniciar sesión."
            )
        raise HTTPException(
            status_code=400,
            detail="No se pudo crear la cuenta. Verifica tus datos."
        )