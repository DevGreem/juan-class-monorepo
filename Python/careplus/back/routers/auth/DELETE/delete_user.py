from fastapi import HTTPException, Depends
from .. import AUTH_ROUTER
from src.database.classes import AuthContext
from src.database.supabase import SupabaseClient
from src.utils import get_auth_context


# Jerarquía de roles: menor número = mayor rango
ROLE_HIERARCHY = {
    'superadmin': 0,
    'admin': 1,
    'medico': 2,
    'enfermero': 3,
    'recepcionista': 4,
}

# Roles eliminables por cada tipo de usuario
SUPERADMIN_DELETABLE_ROLES = {'admin', 'medico', 'enfermero', 'recepcionista'}
ADMIN_DELETABLE_ROLES = {'medico', 'enfermero', 'recepcionista'}


def _get_role_name(auth: AuthContext, user_id: str) -> str:
    """Obtiene el nombre del rol de un usuario dado."""
    result = auth.client.table('user_roles').select(
        'roles(name)'
    ).eq('user_id', user_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return result.data['roles']['name']


@AUTH_ROUTER.delete('/users/{target_user_id}')
def delete_user(
    target_user_id: str,
    auth: AuthContext = Depends(get_auth_context)
) -> dict:
    """Elimina un usuario del sistema.

    - **Superadmin**: puede eliminar todos los usuarios excepto superadmins.
    - **Admin**: solo puede eliminar usuarios con rol inferior (medico, enfermero, recepcionista).
    """

    try:
        # 1. Obtener el rol del caller
        caller_id = auth.user.user.id if auth.user and auth.user.user else None
        if not caller_id:
            raise HTTPException(status_code=401, detail="Usuario no autenticado")

        if caller_id == target_user_id:
            raise HTTPException(status_code=403, detail="No puedes eliminarte a ti mismo")

        caller_role = _get_role_name(auth, caller_id)

        if caller_role == 'superadmin':
            deletable_roles = SUPERADMIN_DELETABLE_ROLES
        elif caller_role == 'admin':
            deletable_roles = ADMIN_DELETABLE_ROLES
        else:
            raise HTTPException(
                status_code=403,
                detail="No tienes permisos para eliminar usuarios."
            )

        # 2. Obtener el rol del usuario objetivo
        target_role = _get_role_name(auth, target_user_id)

        if target_role not in deletable_roles:
            raise HTTPException(
                status_code=403,
                detail=f"No tienes permisos para eliminar usuarios con rol '{target_role}'."
            )

        # 3. Obtener un cliente admin (service_role) para operaciones privilegiadas
        admin_client = SupabaseClient.generate_admin_client()

        # 4. Desvincular created_by en tablas que referencian auth.users(id)
        for table in ['patients', 'consultations', 'diagnostics', 'treatments', 'medical_history']:
            try:
                admin_client.table(table).update(
                    {'created_by': None}
                ).eq('created_by', target_user_id).execute()
                print(f"[DELETE] Nullified created_by in {table}")
            except Exception as ex:
                print(f"[DELETE] Error nullifying {table}: {ex}")

        # 5. Eliminar registro de user_roles
        try:
            result = admin_client.table('user_roles').delete().eq(
                'user_id', target_user_id
            ).execute()
            print(f"[DELETE] user_roles delete result: {result}")
        except Exception as ex:
            print(f"[DELETE] Error deleting user_roles: {ex}")
            raise

        # 6. Eliminar usuario de Supabase Auth (puede fallar si es un usuario seed)
        try:
            SupabaseClient.admin_delete_user(target_user_id)
            print(f"[DELETE] Auth user deleted")
        except Exception as ex:
            print(f"[DELETE] Auth user not found (seed data?): {ex}")
            # El usuario puede no existir en auth.users (ej: datos seed)

        return {
            "success": True,
            "message": "Usuario eliminado exitosamente"
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
