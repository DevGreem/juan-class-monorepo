from fastapi.routing import APIRouter

TREATMENTS_ROUTER: APIRouter = APIRouter(
    prefix="/treatments",
    tags=["Treatments"]
)

from . import GET
from . import POST
from . import PUT
from . import DELETE