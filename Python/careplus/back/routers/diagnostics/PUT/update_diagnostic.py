from fastapi import Depends, HTTPException
from .. import DIAGNOSTICS_ROUTER
from src.utils import get_auth_context
from src.database.classes import AuthContext
from src.database.models import DiagnosticUpdate, DiagnosticResponse


@DIAGNOSTICS_ROUTER.put('/{diagnostic_id}', response_model=DiagnosticResponse)
def update_diagnostic(
    diagnostic_id: str,
    data: DiagnosticUpdate,
    auth: AuthContext = Depends(get_auth_context)
):
    """Actualizar un diagnóstico existente"""
    try:
        update_data = data.model_dump(exclude_none=True, mode='json')
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay datos para actualizar")
        
        response = auth.client.table('diagnostics').update(update_data).eq('id', diagnostic_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Diagnóstico no encontrado")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
