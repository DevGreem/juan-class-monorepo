from fastapi.routing import APIRouter

PATIENTS_ROUTER: APIRouter = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

from . import GET
from . import POST
from . import PUT
from . import DELETE