from .. import PATIENTS_ROUTER

@PATIENTS_ROUTER.get('/')
def get_patients() -> None:
    
    return