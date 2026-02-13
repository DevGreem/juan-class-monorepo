from .auth import AUTH_ROUTER
from .patients import PATIENTS_ROUTER
from .diagnostics import DIAGNOSTICS_ROUTER
from .treatments import TREATMENTS_ROUTER
from .queries import CONSULTATIONS_ROUTER
from fastapi.routing import APIRouter

ROUTERS: list[APIRouter] = [
    AUTH_ROUTER,
    PATIENTS_ROUTER,
    DIAGNOSTICS_ROUTER,
    TREATMENTS_ROUTER,
    CONSULTATIONS_ROUTER,
]