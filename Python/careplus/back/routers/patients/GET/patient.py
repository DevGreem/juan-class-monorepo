from fastapi import Depends, HTTPException
from .. import PATIENTS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import PatientResponse
from typing import Optional


@PATIENTS_ROUTER.get('/', response_model=list[PatientResponse])
def get_patients(
    search: Optional[str] = None,
    is_active: bool = True,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener todos los pacientes"""
    try:
        query = auth.client.table('patients').select('*').eq('is_active', is_active)
        
        if search:
            query = query.or_(f"first_name.ilike.%{search}%,last_name.ilike.%{search}%,document_number.ilike.%{search}%")
        
        response = query.order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@PATIENTS_ROUTER.get('/{patient_id}', response_model=PatientResponse)
def get_patient(
    patient_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener un paciente por ID"""
    try:
        response = auth.client.table('patients').select('*').eq('id', patient_id).single().execute()
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")