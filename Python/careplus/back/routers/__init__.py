from .auth import AUTH_ROUTER
from .patients import PATIENTS_ROUTER
from fastapi.routing import APIRouter

ROUTERS: list[APIRouter] = [
    AUTH_ROUTER,
    PATIENTS_ROUTER
]