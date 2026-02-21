import fastapi
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
# import redis.asyncio as asyncredis

from routers import ROUTERS #, api_identifier

# from fastapi_limiter import FastAPILimiter
# from fastapi_limiter.depends import RateLimiter

from dotenv import load_dotenv

load_dotenv()

# @asynccontextmanager
# async def lifespan(_: FastAPI):
#     redis_connection = asyncredis.from_url("redis://localhost:6379", encoding='utf8')
#     await FastAPILimiter.init(redis_connection, identifier=api_identifier)
#     yield
#     await FastAPILimiter.close()

app: FastAPI = FastAPI(
    title="POMARAY API",
    description="API of POMARAY",
    version="0.1.0",
    docs_url="/docs",
    #lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://careplus-front.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")#, dependencies=[Depends(RateLimiter(times=2, seconds=30))])
def home():
    return {"status": "OK"}

for router in ROUTERS:
    app.include_router(router)

# if __name__ == "__main__":
#     import uvicorn
    
#     uvicorn.run(
#         "main:app",
#         host="0.0.0.0",
#         port=8000,
#         reload=True
#     )