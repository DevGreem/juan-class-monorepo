from fastapi import Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from .. import AUTH_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


class UserMeResponse(BaseModel):
    user_id: str
    email: str
    role_name: str
    full_name: str
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    can_manage_users: bool = False


@AUTH_ROUTER.get('/me')
def get_me(auth: AuthContext = Depends(get_auth_context)) -> UserMeResponse:
    """Obtiene la información del usuario autenticado, incluyendo su rol."""

    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")

        result = auth.client.table('v_users').select('*').eq(
            'user_id', user_id
        ).single().execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Perfil de usuario no encontrado")

        data = result.data
        return UserMeResponse(
            user_id=data['user_id'],
            email=data['email'],
            role_name=data['role_name'],
            full_name=data['full_name'],
            specialty=data.get('specialty'),
            license_number=data.get('license_number'),
            phone=data.get('phone'),
            is_active=data.get('is_active', True),
            can_manage_users=data.get('can_manage_users', False),
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener información del usuario")
