from fastapi import Depends, HTTPException
from .. import CONSULTATIONS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import ConsultationCreate, ConsultationResponse


@CONSULTATIONS_ROUTER.post('/', response_model=ConsultationResponse, status_code=201)
def create_consultation(
    data: ConsultationCreate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Crear una nueva consulta médica"""
    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        
        consultation_data = data.model_dump(exclude_none=True, mode='json')
        consultation_data['created_by'] = user_id
        
        response = auth.client.table('consultations').insert(consultation_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
