from fastapi import Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from .. import AUTH_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


class UserListItem(BaseModel):
    user_id: str
    email: str
    role_name: str
    full_name: str
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None


@AUTH_ROUTER.get('/users')
def get_users(auth: AuthContext = Depends(get_auth_context)) -> list[UserListItem]:
    """Obtiene la lista de usuarios. Solo admin y superadmin pueden acceder."""

    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")

        # Verificar que el caller es admin o superadmin
        caller = auth.client.table('user_roles').select(
            'roles(name)'
        ).eq('user_id', user_id).single().execute()

        if not caller.data:
            raise HTTPException(status_code=403, detail="No tienes un rol asignado")

        caller_role = caller.data['roles']['name']
        if caller_role not in ('admin', 'superadmin'):
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para ver la lista de usuarios"
            )

        # Obtener todos los usuarios desde la vista
        result = auth.client.table('v_users').select('*').order(
            'created_at', desc=True
        ).execute()

        return [
            UserListItem(
                user_id=u['user_id'],
                email=u['email'],
                role_name=u['role_name'],
                full_name=u['full_name'],
                specialty=u.get('specialty'),
                license_number=u.get('license_number'),
                phone=u.get('phone'),
                is_active=u.get('is_active', True),
                created_at=u.get('created_at'),
            )
            for u in result.data
        ]

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Error al obtener la lista de usuarios")
