from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- AUTH & USERS ---
class LoginRequest(BaseModel):
    username: str # Email
    password: str

class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    role: str = "student"

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    class Config:
        from_attributes = True

# --- CICLOS ---
class CicloCreate(BaseModel):
    nombre: str
    inicio: int
    fin: int

# --- ASIGNACIONES (Drag & Drop) ---
class AsignacionRequest(BaseModel):
    alumno_id: int
    empresa_id: int
    ciclo_id: int

# --- SEGUIMIENTO ---
class SeguimientoCreate(BaseModel):
    empresa_id: int
    profesor_id: int
    observaciones: str

# --- RESPUESTAS PARA EL FRONT (Dashboards) ---
class DashboardOut(BaseModel):
    estado: str
    telefono: Optional[str] = None
    ciclo: Optional[str] = None
    empresa: Optional[str] = None
    direccion: Optional[str] = None
    tutor_laboral: Optional[str] = None
    email_contacto: Optional[str] = None

class PlazaResumen(BaseModel):
    id: int
    nombre: str
    totales: int
    libres: int