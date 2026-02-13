from fastapi import HTTPException
from src.database.classes import LoginResponse, VerifyOtpRequest
from src.utils import verify_otp as verify_otp_code
from src.database import SupabaseClient
from . import AUTH_ROUTER


@AUTH_ROUTER.post('/verify-otp')
def verify_otp(data: VerifyOtpRequest) -> LoginResponse:
    """Paso 2 del login: verifica el código OTP y retorna el token de acceso.

    # Args:
        data (VerifyOtpRequest): user_id + código OTP de 6 dígitos
    
    # Returns:
        LoginResponse: token de acceso si el código es válido
    """
    
    try:
        # Necesitamos un cliente para consultar la tabla verification_codes
        # Usamos el cliente base (anon key) ya que las políticas RLS lo permiten
        # a usuarios autenticados, pero el token está almacenado en la tabla.
        # Usamos un truco: primero buscamos con service-level access
        client = SupabaseClient.generate_client()
        
        # Buscar el código OTP pendiente para este usuario
        from datetime import datetime, timezone
        result = client.table('verification_codes').select('*').eq(
            'user_id', data.user_id
        ).eq(
            'used', False
        ).gte(
            'expires_at', datetime.now(timezone.utc).isoformat()
        ).order(
            'created_at', desc=True
        ).limit(1).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=400,
                detail="Código expirado o no encontrado. Inicia sesión nuevamente."
            )
        
        record = result.data[0]
        
        # Verificar intentos máximos
        if record['attempts'] >= record['max_attempts']:
            client.table('verification_codes').update({
                'used': True
            }).eq('id', record['id']).execute()
            raise HTTPException(
                status_code=400,
                detail="Máximo de intentos alcanzado. Inicia sesión nuevamente."
            )
        
        # Incrementar intentos
        client.table('verification_codes').update({
            'attempts': record['attempts'] + 1
        }).eq('id', record['id']).execute()
        
        # Verificar código
        if record['code'] != data.code:
            remaining = record['max_attempts'] - record['attempts'] - 1
            raise HTTPException(
                status_code=400,
                detail=f"Código incorrecto. {remaining} intentos restantes."
            )
        
        # Marcar como usado y devolver el access_token
        client.table('verification_codes').update({
            'used': True
        }).eq('id', record['id']).execute()
        
        return LoginResponse(
            token=record['access_token'],
            success=True,
            requires_verification=False,
            message="Verificación exitosa"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Error al verificar el código"
        )
