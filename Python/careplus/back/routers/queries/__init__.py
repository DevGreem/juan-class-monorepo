from fastapi.routing import APIRouter

CONSULTATIONS_ROUTER: APIRouter = APIRouter(
    prefix="/consultations",
    tags=["Consultations"]
)

from . import GET
from . import POST
from . import PUT
from . import DELETE