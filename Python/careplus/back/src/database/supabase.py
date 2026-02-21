from dataclasses import dataclass
from src._settings import settings

from supabase import (
    create_client,
    Client,
    ClientOptions
)

from supabase_auth import (
    SignInWithPasswordCredentials,
    SignUpWithPasswordCredentials
)

from typing import (
    Optional
)

@dataclass
class SupabaseLoginResult:
    access_token: str
    refresh_token: str
    user_id: str
    email: str
    logged_client: "SupabaseClient"

@dataclass
class SupabaseSignUpResult:
    access_token: Optional[str]
    user_id: str
    email: str
    needs_confirmation: bool

class SupabaseClient:
    """Supabase Client
    
    **Inherits**: Client
    """
    
    def __init__(
        self,
        access_token: Optional[str] = None,
        options: Optional[ClientOptions] = None
    ):
        
        if options is None:
            options = ClientOptions()
        
        if access_token:
            options.headers['Authorization'] = f'Bearer {access_token}'
        
        self.__new_client(options)
    
    def __new_client(self, options: Optional[ClientOptions] = None):
        '''Generate a new client following the new options
        
        :param self: Description
        :param new_options: Description
        :type new_options: Optional[ClientOptions]
        '''
        
        url: Optional[str] = settings.supabase_url
        key: Optional[str] = settings.supabase_key
        
        if url is None or key is None:
            raise Exception("Supabase url or key not exists!")
        
        self.__client: Client = create_client(url, key, options)
    
    @staticmethod
    def generate_client() -> Client:
        return create_client(settings.supabase_url, settings.supabase_key)
    
    @staticmethod
    def generate_admin_client() -> Client:
        """Generate a client using the service_role key for admin operations."""
        service_key = settings.supabase_service_role_key
        if not service_key:
            raise Exception("Service role key not configured. Set PROD/TEST_SUPABASE_SERVICE_ROLE_KEY in .env")
        return create_client(settings.supabase_url, service_key)
    
    @property
    def client(self):
        return self.__client
    
    @staticmethod
    def sign_in(args: SignInWithPasswordCredentials) -> SupabaseLoginResult:
        
        client = SupabaseClient.generate_client()
        
        response = client.auth.sign_in_with_password(credentials=args)
        
        if not response.session:
            raise Exception("Invalid Credentials")
        
        return SupabaseLoginResult(
            access_token=response.session.access_token,
            refresh_token=response.session.refresh_token,
            user_id=response.user.id if response.user else "",
            email=response.user.email or "" if response.user else "",
            logged_client=SupabaseClient(response.session.access_token)
        )

    @staticmethod
    def sign_up(args: SignUpWithPasswordCredentials) -> SupabaseSignUpResult:
        
        client = SupabaseClient.generate_client()
        
        response = client.auth.sign_up(credentials=args)
        
        if not response.user:
            raise Exception("Sign up failed")
        
        return SupabaseSignUpResult(
            access_token=response.session.access_token if response.session else None,
            user_id=response.user.id,
            email=response.user.email or "",
            needs_confirmation=response.session is None
        )

    @staticmethod
    def admin_create_user(email: str, password: str) -> SupabaseSignUpResult:
        """Create a user using the admin/service_role API (skips email confirmation)."""
        
        admin_client = SupabaseClient.generate_admin_client()
        
        response = admin_client.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
        })
        
        if not response.user:
            raise Exception("Admin user creation failed")
        
        return SupabaseSignUpResult(
            access_token=None,
            user_id=response.user.id,
            email=response.user.email or "",
            needs_confirmation=False
        )

    @staticmethod
    def refresh_session(refresh_token: str) -> SupabaseLoginResult:
        """Refresh an expired session using the refresh_token."""
        
        client = SupabaseClient.generate_client()
        response = client.auth.refresh_session(refresh_token)
        
        if not response.session:
            raise Exception("Could not refresh session")
        
        return SupabaseLoginResult(
            access_token=response.session.access_token,
            refresh_token=response.session.refresh_token,
            user_id=response.user.id if response.user else "",
            email=response.user.email or "" if response.user else "",
            logged_client=SupabaseClient(response.session.access_token)
        )

    @staticmethod
    def admin_delete_user(user_id: str) -> None:
        """Delete a user from Supabase Auth using the service_role key."""
        
        admin_client = SupabaseClient.generate_admin_client()
        admin_client.auth.admin.delete_user(user_id)