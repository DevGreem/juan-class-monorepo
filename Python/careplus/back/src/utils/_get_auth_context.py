from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.database import SupabaseClient
from supabase_auth import UserResponse
import logging
from src.database.classes import AuthContext

security = HTTPBearer()

def get_auth_context(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthContext:
    
    token = credentials.credentials
    
    logging.debug("Received authorization credentials.")
    
    try:
        client = SupabaseClient(token).client
        user: UserResponse|None = client.auth.get_user(token)
    except Exception as e:
        error_msg = str(e).lower()
        if "expired" in error_msg or "invalid" in error_msg or "token" in error_msg:
            raise HTTPException(
                status_code=401,
                detail="Token expirado o inválido. Por favor, usa tu refresh_token para obtener un nuevo token en /auth/refresh."
            )
        raise HTTPException(
            status_code=401,
            detail="No se pudo autenticar el usuario."
        )
    
    return AuthContext(
        client=client,
        user=user,
        token=token
    )
    
    