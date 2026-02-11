import jwt
from src import _settings
from src import SupabaseAccessPayload
from src import Algorithm

def decode_supabase_token(token: str) -> SupabaseAccessPayload:
    
    payload = jwt.decode(
        token,
        _settings.supabase_api_key,
        algorithms=[Algorithm.RS256],
        audience="authenticated"
    )
    
    return payload
