from fastapi import Depends, HTTPException
from .. import PATIENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext


@PATIENTS_ROUTER.delete('/{patient_id}', status_code=204)
def delete_patient(
    patient_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Eliminar un paciente (soft delete: marca como inactivo)"""
    try:
        response = auth.client.table('patients').update(
            {'is_active': False}
        ).eq('id', patient_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
