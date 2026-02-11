from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Literal

class Settings(BaseSettings):
    '''
    Class for manage Environment Variables
    '''
    
    def __init__(self):
        super().__init__(_case_sensitive=False, _env_file=".env")
        
    fastapi_env: Literal['local', 'production'] = 'local'
    debug: bool = True
    
    app_redis_url: str
    
    prod_supabase_key: str
    test_supabase_key: str
    
    prod_supabase_url: str
    test_supabase_url: str
    
    prod_supabase_public_api_key: str
    test_supabase_public_api_key: str
    
    # class Config:
    #     env_file = ".env"
    #     case_sensitive = False
        
    def env_is_local(self):
        return self.fastapi_env == "local"
    
    @property
    def env(self) -> str:
        '''Returns actual app environment
        
        :param self: Description
        :return: Actual environment
        :rtype: str
        '''
        
        return self.fastapi_env

    @property
    def supabase_key(self) -> str:
        '''Returns supabase enviroment key (local or production)
        
        :param self: Description
        :return: Supabase Env Key
        :rtype: str
        '''
        
        return (
            self.test_supabase_key
            if self.env_is_local()
            else self.prod_supabase_key
        )
    
    @property
    def supabase_url(self) -> str:
        '''Returns supabase enviroment url (local or production)
        
        :param self: Description
        :return: Supabase Env Url
        :rtype: str
        '''
        
        return (
            self.test_supabase_url
            if self.env_is_local()
            else self.prod_supabase_url
        )
    
    @property
    def supabase_api_key(self) -> str:
        
        return (
            self.test_supabase_public_api_key
            if self.env_is_local()
            else self.prod_supabase_public_api_key
        )

@lru_cache
def get_settings() -> Settings:
    return Settings() # type: ignore

settings = get_settings()
