import secrets
import string
from datetime import datetime, timedelta, timezone
from src.database import SupabaseClient

OTP_LENGTH = 6
OTP_EXPIRY_MINUTES = 10
OTP_MAX_ATTEMPTS = 5


def generate_otp() -> str:
    """Genera un código OTP de 6 dígitos."""
    return ''.join(secrets.choice(string.digits) for _ in range(OTP_LENGTH))


def store_otp(user_id: str, email: str, code: str, access_token: str) -> bool:
    """Almacena el código OTP en la tabla verification_codes junto con el access_token."""
    
    client = SupabaseClient(access_token).client
    expires_at = (datetime.now(timezone.utc) + timedelta(minutes=OTP_EXPIRY_MINUTES)).isoformat()
    
    # Invalidar códigos anteriores del usuario
    client.table('verification_codes').update({
        'used': True
    }).eq('user_id', user_id).eq('used', False).execute()
    
    # Insertar nuevo código con el access_token
    client.table('verification_codes').insert({
        'user_id': user_id,
        'email': email,
        'code': code,
        'access_token': access_token,
        'expires_at': expires_at,
        'attempts': 0,
        'max_attempts': OTP_MAX_ATTEMPTS
    }).execute()
    
    return True


def verify_otp(user_id: str, code: str, access_token: str) -> dict:
    """Verifica el código OTP. Retorna el access_token original si es válido."""
    
    client = SupabaseClient(access_token).client
    
    # Buscar el código más reciente no usado y no expirado
    result = client.table('verification_codes').select('*').eq(
        'user_id', user_id
    ).eq(
        'used', False
    ).gte(
        'expires_at', datetime.now(timezone.utc).isoformat()
    ).order(
        'created_at', desc=True
    ).limit(1).execute()
    
    if not result.data:
        return {'valid': False, 'error': 'Código expirado o no encontrado'}
    
    record = result.data[0]
    
    # Verificar intentos máximos
    if record['attempts'] >= record['max_attempts']:
        client.table('verification_codes').update({
            'used': True
        }).eq('id', record['id']).execute()
        return {'valid': False, 'error': 'Máximo de intentos alcanzado. Solicita un nuevo código.'}
    
    # Incrementar intentos
    client.table('verification_codes').update({
        'attempts': record['attempts'] + 1
    }).eq('id', record['id']).execute()
    
    # Verificar código
    if record['code'] != code:
        remaining = record['max_attempts'] - record['attempts'] - 1
        return {'valid': False, 'error': f'Código incorrecto. {remaining} intentos restantes.'}
    
    # Marcar como usado
    client.table('verification_codes').update({
        'used': True
    }).eq('id', record['id']).execute()
    
    return {'valid': True, 'access_token': record['access_token']}
