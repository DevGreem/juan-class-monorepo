from fastapi.routing import APIRouter

DIAGNOSTICS_ROUTER: APIRouter = APIRouter(
    prefix="/diagnostics",
    tags=["Diagnostics"]
)

from . import GET
from . import POST
from . import PUT
from . import DELETE