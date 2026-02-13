from fastapi import Depends, HTTPException
from .. import CONSULTATIONS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import ConsultationUpdate, ConsultationResponse


@CONSULTATIONS_ROUTER.put('/{consultation_id}', response_model=ConsultationResponse)
def update_consultation(
    consultation_id: str,
    data: ConsultationUpdate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Actualizar una consulta existente"""
    try:
        update_data = data.model_dump(exclude_none=True, mode='json')
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        response = auth.client.table('consultations').update(update_data).eq('id', consultation_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Consulta no encontrada")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
