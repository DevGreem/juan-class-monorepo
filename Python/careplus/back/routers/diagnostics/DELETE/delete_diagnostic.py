from fastapi import Depends, HTTPException
from .. import DIAGNOSTICS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


@DIAGNOSTICS_ROUTER.delete('/{diagnostic_id}', status_code=204)
def delete_diagnostic(
    diagnostic_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Eliminar un diagnóstico"""
    try:
        response = auth.client.table('diagnostics').delete().eq('id', diagnostic_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Diagnóstico no encontrado")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
