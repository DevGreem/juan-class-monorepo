from fastapi import HTTPException
from src.database import SupabaseClient
from src.database.classes import LoginResponse
from supabase_auth import SignUpWithPasswordCredentials
from . import AUTH_ROUTER

@AUTH_ROUTER.post('/sign_up')
def sign_up(data: SignUpWithPasswordCredentials) -> LoginResponse:
    """It requests the supabase access token and returns it (with the new user created) so that the user can access it through other endpoints.

    # Args:
        data (SignInWithPasswordCredentials): User Credentials
        response (Response): API Response
    """
    
    try:

        access_token = SupabaseClient.sign_up(data)
        
        return LoginResponse(
            token=access_token,
            success=True
        )
    except Exception:
        
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )