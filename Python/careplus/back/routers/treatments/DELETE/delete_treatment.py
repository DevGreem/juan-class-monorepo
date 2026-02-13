from fastapi import Depends, HTTPException
from .. import TREATMENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


@TREATMENTS_ROUTER.delete('/{treatment_id}', status_code=204)
def delete_treatment(
    treatment_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Eliminar un tratamiento"""
    try:
        response = auth.client.table('treatments').delete().eq('id', treatment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
