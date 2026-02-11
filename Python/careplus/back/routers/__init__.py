from .auth import AUTH_ROUTER
from fastapi.routing import APIRouter

ROUTERS: list[APIRouter] = [
    AUTH_ROUTER
]