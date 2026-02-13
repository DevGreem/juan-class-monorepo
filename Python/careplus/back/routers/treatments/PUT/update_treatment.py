from fastapi import Depends, HTTPException
from .. import TREATMENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import TreatmentUpdate, TreatmentResponse


@TREATMENTS_ROUTER.put('/{treatment_id}', response_model=TreatmentResponse)
def update_treatment(
    treatment_id: str,
    data: TreatmentUpdate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Actualizar un tratamiento existente"""
    try:
        update_data = data.model_dump(exclude_none=True, mode='json')
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        response = auth.client.table('treatments').update(update_data).eq('id', treatment_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
