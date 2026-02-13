from fastapi import Depends, HTTPException
from .. import CONSULTATIONS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import ConsultationResponse
from typing import Optional


@CONSULTATIONS_ROUTER.get('/', response_model=list[ConsultationResponse])
def get_consultations(
    patient_id: Optional[str] = None,
    status: Optional[str] = None,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener todas las consultas, opcionalmente filtradas por paciente o estado"""
    try:
        query = auth.client.table('consultations').select('*')
        
        if patient_id:
            query = query.eq('patient_id', patient_id)
        if status:
            query = query.eq('status', status)
        
        response = query.order('consultation_date', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@CONSULTATIONS_ROUTER.get('/{consultation_id}', response_model=ConsultationResponse)
def get_consultation(
    consultation_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener una consulta por ID"""
    try:
        response = auth.client.table('consultations').select('*').eq('id', consultation_id).single().execute()
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
