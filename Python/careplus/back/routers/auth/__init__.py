from fastapi.routing import APIRouter

AUTH_ROUTER: APIRouter = APIRouter(
    prefix='/auth',
    tags=['auth']
)

from . import POST
from . import GET
from . import PUT
from . import DELETE