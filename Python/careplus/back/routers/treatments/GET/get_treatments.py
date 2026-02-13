from fastapi import Depends, HTTPException
from .. import TREATMENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import TreatmentResponse
from typing import Optional


@TREATMENTS_ROUTER.get('/', response_model=list[TreatmentResponse])
def get_treatments(
    patient_id: Optional[str] = None,
    status: Optional[str] = None,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener todos los tratamientos, opcionalmente filtrados por paciente o estado"""
    try:
        query = auth.client.table('treatments').select('*')
        
        if patient_id:
            query = query.eq('patient_id', patient_id)
        if status:
            query = query.eq('status', status)
        
        response = query.order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@TREATMENTS_ROUTER.get('/{treatment_id}', response_model=TreatmentResponse)
def get_treatment(
    treatment_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener un tratamiento por ID"""
    try:
        response = auth.client.table('treatments').select('*').eq('id', treatment_id).single().execute()
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Tratamiento no encontrado")
