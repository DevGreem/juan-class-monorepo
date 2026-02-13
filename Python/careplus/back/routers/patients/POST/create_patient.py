from fastapi import Depends, HTTPException
from .. import PATIENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import PatientCreate, PatientResponse


@PATIENTS_ROUTER.post('/', response_model=PatientResponse, status_code=201)
def create_patient(
    data: PatientCreate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Crear un nuevo paciente"""
    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        
        patient_data = data.model_dump(mode='json')
        patient_data['created_by'] = user_id
        
        response = auth.client.table('patients').insert(patient_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
