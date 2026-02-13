from fastapi import Depends, HTTPException
from .. import PATIENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import PatientUpdate, PatientResponse


@PATIENTS_ROUTER.put('/{patient_id}', response_model=PatientResponse)
def update_patient(
    patient_id: str,
    data: PatientUpdate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Actualizar un paciente existente"""
    try:
        update_data = data.model_dump(exclude_none=True, mode='json')
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        response = auth.client.table('patients').update(update_data).eq('id', patient_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
