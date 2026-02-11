from . import SupabaseClient

def test_client():
    
    client: SupabaseClient = SupabaseClient("inside")
    
    data: list = client.client.table("document_types").select().execute().data
    
    assert len(data) == 3 # Cambiar el 3 con la cantidad de tipos de documentos actuales