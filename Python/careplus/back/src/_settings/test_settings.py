from . import settings

def test_settings():
    
    assert settings.fastapi_env == settings.env
    
    key_tester = settings.test_supabase_key if settings.env_is_local() else settings.prod_supabase_key
    
    assert settings.supabase_key == key_tester
    
    url_tester = settings.test_supabase_url if settings.env_is_local() else settings.prod_supabase_url
    
    assert settings.supabase_url == url_tester
    
    public_api_tester = settings.test_supabase_public_api_key if settings.env_is_local() else settings.prod_supabase_public_api_key
    
    assert settings.supabase_api_key == public_api_tester