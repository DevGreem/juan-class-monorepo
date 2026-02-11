from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.database import SupabaseClient
from supabase_auth import UserResponse
import logging
from src.database.classes import AuthContext

security = HTTPBearer()

def get_auth_context(credentials: HTTPAuthorizationCredentials = Depends(security)) -> AuthContext:
    
    token = credentials.credentials
    
    logging.debug("Received authorization credentials.")
    
    client = SupabaseClient(token).client
    user: UserResponse|None = client.auth.get_user(token)
    
    return AuthContext(
        client=client,
        user=user,
        token=token
    )
    
    