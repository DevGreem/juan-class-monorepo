from fastapi import HTTPException, Depends
from typing import Optional
from src.database import SupabaseClient
from src.database.classes import AuthContext
from src.utils import get_auth_context
from src.api.models import SignUpRequest, SignUpResponse
from . import AUTH_ROUTER


# Roles que cada tipo de usuario puede crear
ADMIN_ALLOWED_ROLES = {'medico', 'enfermero', 'recepcionista'}
SUPERADMIN_ALLOWED_ROLES = {'medico', 'enfermero', 'recepcionista', 'admin'}


def _get_caller_role(auth: AuthContext) -> str:
    """Obtiene el rol del usuario autenticado desde la tabla user_roles + roles."""
    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        if not user_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")

        result = auth.client.table('user_roles').select(
            'roles(name)'
        ).eq('user_id', user_id).single().execute()

        if not result.data:
            raise HTTPException(status_code=403, detail="No tienes un rol asignado")

        return result.data['roles']['name']
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=403, detail="No se pudo verificar tu rol")


@AUTH_ROUTER.post('/sign_up')
def sign_up(data: SignUpRequest, auth: AuthContext = Depends(get_auth_context)) -> SignUpResponse:
    """Crea un nuevo usuario. Solo accesible por admin y superadmin.

    - **Admin**: puede crear usuarios con rol 'medico', 'enfermero', 'recepcionista'
    - **Superadmin**: puede crear los mismos + rol 'admin'

    # Args:
        data (SignUpRequest): Datos del nuevo usuario (email, password, full_name, role, etc.)
        auth (AuthContext): Contexto de autenticación del admin/superadmin
    """

    # 1. Verificar el rol del usuario que hace la petición
    caller_role = _get_caller_role(auth)

    if caller_role == 'superadmin':
        allowed_roles = SUPERADMIN_ALLOWED_ROLES
    elif caller_role == 'admin':
        allowed_roles = ADMIN_ALLOWED_ROLES
    else:
        raise HTTPException(
            status_code=403,
            detail="No tienes permisos para crear usuarios. Solo administradores pueden hacerlo."
        )

    # 2. Validar que el rol solicitado es permitido
    if data.role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail=f"No tienes permisos para crear usuarios con rol '{data.role}'. "
                   f"Roles permitidos: {', '.join(sorted(allowed_roles))}"
        )

    try:
        # 3. Crear el usuario en Supabase Auth (usando service_role key)
        result = SupabaseClient.admin_create_user(
            email=data.email,
            password=data.password,
        )

        # 4. Buscar el role_id correspondiente
        role_result = auth.client.table('roles').select('id').eq(
            'name', data.role
        ).single().execute()

        if not role_result.data:
            raise HTTPException(status_code=400, detail=f"Rol '{data.role}' no encontrado en el sistema")

        # 5. Asignar el rol en la tabla user_roles
        auth.client.table('user_roles').insert({
            'user_id': result.user_id,
            'role_id': role_result.data['id'],
            'full_name': data.full_name,
            'specialty': data.specialty,
            'license_number': data.license_number,
            'phone': data.phone,
        }).execute()

        return SignUpResponse(
            success=True,
            message=f"Usuario '{data.email}' creado exitosamente con rol '{data.role}'",
            user_id=result.user_id,
        )

    except HTTPException:
        raise
    except Exception as e:
        detail = str(e)
        if "already registered" in detail.lower() or "already been registered" in detail.lower():
            raise HTTPException(
                status_code=409,
                detail="Este correo ya está registrado."
            )
        raise HTTPException(
            status_code=400,
            detail=f"No se pudo crear el usuario: {detail}"
        )