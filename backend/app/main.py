from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine

from app.router import auth, admin, profesores, alumnos

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestión de Prácticas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(profesores.router)
app.include_router(alumnos.router)