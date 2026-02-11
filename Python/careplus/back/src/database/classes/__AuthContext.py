from dataclasses import dataclass
from supabase import Client
from supabase_auth import UserResponse

@dataclass
class AuthContext:
    client: Client
    user: UserResponse|None
    token: str