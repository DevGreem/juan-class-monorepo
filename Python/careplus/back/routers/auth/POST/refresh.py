from fastapi import HTTPException
from pydantic import BaseModel
from src.database import SupabaseClient
from src.database.classes import LoginResponse
from . import AUTH_ROUTER


class RefreshRequest(BaseModel):
    refresh_token: str


@AUTH_ROUTER.post('/refresh')
def refresh_token(data: RefreshRequest) -> LoginResponse:
    """Renueva el access_token usando un refresh_token válido.

    # Args:
        data (RefreshRequest): refresh_token del usuario
    
    # Returns:
        LoginResponse: Nuevo access_token y refresh_token
    """
    
    try:
        result = SupabaseClient.refresh_session(data.refresh_token)
        
        return LoginResponse(
            token=result.access_token,
            refresh_token=result.refresh_token,
            success=True,
            requires_verification=False,
            message="Token renovado exitosamente"
        )
        
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Refresh token inválido o expirado. Inicia sesión nuevamente."
        )
