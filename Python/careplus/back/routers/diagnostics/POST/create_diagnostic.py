from fastapi import Depends, HTTPException
from .. import DIAGNOSTICS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import DiagnosticCreate, DiagnosticResponse


@DIAGNOSTICS_ROUTER.post('/', response_model=DiagnosticResponse, status_code=201)
def create_diagnostic(
    data: DiagnosticCreate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Crear un nuevo diagnóstico"""
    try:
        user_id = auth.user.user.id if auth.user and auth.user.user else None
        
        diagnostic_data = data.model_dump(exclude_none=True, mode='json')
        diagnostic_data['created_by'] = user_id
        
        response = auth.client.table('diagnostics').insert(diagnostic_data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
