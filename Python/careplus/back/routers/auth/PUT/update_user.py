from fastapi import HTTPException, Depends
from .. import AUTH_ROUTER
from src.database.classes import AuthContext
from src.utils import get_auth_context
from src.api.models import UpdateUserRequest


# Jerarquía de roles: menor número = mayor rango
ROLE_HIERARCHY = {
    'superadmin': 0,
    'admin': 1,
    'medico': 2,
    'enfermero': 3,
    'recepcionista': 4,
}

# Roles editables por cada tipo de usuario
SUPERADMIN_EDITABLE_ROLES = {'admin', 'medico', 'enfermero', 'recepcionista'}
ADMIN_EDITABLE_ROLES = {'medico', 'enfermero', 'recepcionista'}

# Roles a los que se puede cambiar un usuario
SUPERADMIN_ASSIGNABLE_ROLES = {'admin', 'medico', 'enfermero', 'recepcionista'}
ADMIN_ASSIGNABLE_ROLES = {'medico', 'enfermero', 'recepcionista'}


def _get_role_name(auth: AuthContext, user_id: str) -> str:
    """Obtiene el nombre del rol de un usuario dado."""
    result = auth.client.table('user_roles').select(
        'roles(name)'
    ).eq('user_id', user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return result.data['roles']['name']


@AUTH_ROUTER.put('/users/{target_user_id}')
def update_user(
    target_user_id: str,
    data: UpdateUserRequest,
    auth: AuthContext = Depends(get_auth_context)
) -> dict:
    """Edita un usuario existente. 
    
    - **Superadmin**: puede editar todos los usuarios excepto superadmins.
    - **Admin**: solo puede editar usuarios con rol inferior (medico, enfermero, recepcionista).
    """

    try:
        # 1. Obtener el rol del caller
        caller_id = auth.user.user.id if auth.user and auth.user.user else None
        if not caller_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")

        caller_role = _get_role_name(auth, caller_id)

        if caller_role == 'superadmin':
            editable_roles = SUPERADMIN_EDITABLE_ROLES
            assignable_roles = SUPERADMIN_ASSIGNABLE_ROLES
        elif caller_role == 'admin':
            editable_roles = ADMIN_EDITABLE_ROLES
            assignable_roles = ADMIN_ASSIGNABLE_ROLES
        else:
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para editar usuarios."
            )

        # 2. Obtener el rol actual del usuario objetivo
        target_role = _get_role_name(auth, target_user_id)

        if target_role not in editable_roles:
            raise HTTPException(
                status_code=403,
                detail=f"No tienes permisos para editar usuarios con rol '{target_role}'."
            )

        # 3. Si se quiere cambiar el rol, validar que el nuevo rol sea asignable
        new_role_id = None
        if data.role is not None:
            if data.role not in assignable_roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"No tienes permisos para asignar el rol '{data.role}'. "
                           f"Roles permitidos: {', '.join(sorted(assignable_roles))}"
                )
            # Buscar el role_id del nuevo rol
            role_result = auth.client.table('roles').select('id').eq(
                'name', data.role
            ).single().execute()

            if not role_result.data:
                raise HTTPException(status_code=400, detail=f"Rol '{data.role}' no encontrado en el sistema")

            new_role_id = role_result.data['id']

        # 4. Construir el objeto de actualización para user_roles
        update_data = {}
        if data.full_name is not None:
            update_data['full_name'] = data.full_name
        if data.specialty is not None:
            update_data['specialty'] = data.specialty
        if data.license_number is not None:
            update_data['license_number'] = data.license_number
        if data.phone is not None:
            update_data['phone'] = data.phone
        if data.is_active is not None:
            update_data['is_active'] = data.is_active
        if new_role_id is not None:
            update_data['role_id'] = new_role_id

        if not update_data:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos para actualizar")

        # 5. Actualizar
        auth.client.table('user_roles').update(
            update_data
        ).eq('user_id', target_user_id).execute()

        return {
            "success": True,
            "message": "Usuario actualizado exitosamente"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al actualizar el usuario: {str(e)}"
        )
