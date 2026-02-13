from fastapi import Depends, HTTPException
from .. import DIAGNOSTICS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import DiagnosticResponse
from typing import Optional


@DIAGNOSTICS_ROUTER.get('/', response_model=list[DiagnosticResponse])
def get_diagnostics(
    patient_id: Optional[str] = None,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener todos los diagnósticos, opcionalmente filtrados por paciente"""
    try:
        query = auth.client.table('diagnostics').select('*')
        
        if patient_id:
            query = query.eq('patient_id', patient_id)
        
        response = query.order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@DIAGNOSTICS_ROUTER.get('/{diagnostic_id}', response_model=DiagnosticResponse)
def get_diagnostic(
    diagnostic_id: str,
    auth: AuthContext = Depends(get_auth_context)
):
    """Obtener un diagnóstico por ID"""
    try:
        response = auth.client.table('diagnostics').select('*').eq('id', diagnostic_id).single().execute()
        return response.data
    except Exception:
        raise HTTPException(status_code=404, detail="Diagnóstico no encontrado")
