from fastapi import Depends, HTTPException
from .. import TREATMENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import TreatmentCreate, TreatmentResponse


@TREATMENTS_ROUTER.post('/', response_model=TreatmentResponse, status_code=201)
def create_treatment(
    data: TreatmentCreate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Crear un nuevo tratamiento"""
    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        
        treatment_data = data.model_dump(exclude_none=True, mode='json')
        treatment_data['created_by'] = user_id
        
        response = auth.client.table('treatments').insert(treatment_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
