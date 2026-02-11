import jwt
from src import settings
from src import SupabaseAccessPayload
from src import Algorithm

def decode_supabase_token(token: str) -> SupabaseAccessPayload:
    
    payload = jwt.decode(
        token,
        settings.supabase_api_key,
        algorithms=[Algorithm.RS256],
        audience="authenticated"
    )
    
    return payload
