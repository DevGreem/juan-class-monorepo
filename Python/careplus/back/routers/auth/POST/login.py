from fastapi import Response, HTTPException, Request
from src import LoginResponse, SupabaseClient
from supabase_auth import SignInWithPasswordCredentials
from . import AUTH_ROUTER

@AUTH_ROUTER.post('/login')
def login(data: SignInWithPasswordCredentials, request: Request, response: Response) -> LoginResponse:
    """It requests the supabase access token and returns it (if the credentials are correct) so that the user can access it through other endpoints.

    # Args:
        data (SignInWithPasswordCredentials): User Credentials
        response (Response): API Response
    """
    
    try:

        access_token = SupabaseClient.sign_in(data)
        
        return LoginResponse(token=access_token, success=True)
    except Exception:
        
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials"
        )