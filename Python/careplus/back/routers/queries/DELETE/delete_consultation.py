from fastapi import Depends, HTTPException
from .. import CONSULTATIONS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


@CONSULTATIONS_ROUTER.delete('/{consultation_id}', status_code=204)
def delete_consultation(
    consultation_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Eliminar una consulta"""
    try:
        response = auth.client.table('consultations').delete().eq('id', consultation_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Consulta no encontrada")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
