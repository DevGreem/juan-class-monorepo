from dataclasses import dataclass
from src.settings import settings

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
    logged_client: "SupabaseClient"

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
    
    @property
    def client(self):
        return self.__client
    
    @staticmethod
    def sign_in(args: SignInWithPasswordCredentials) -> str:
        
        client = SupabaseClient.generate_client()
        
        response = client.auth.sign_in_with_password(credentials=args)
        
        if not response.session:
            raise Exception("Invalid Credentials")
        
        return response.session.access_token

    @staticmethod
    def sign_up(args: SignUpWithPasswordCredentials) -> str:
        
        client = SupabaseClient.generate_client()
        
        response = client.auth.sign_up(credentials=args)
        
        if not response.session:
            raise Exception("Invalid Credentials")
        
        return response.session.access_token