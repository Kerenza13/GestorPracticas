import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db 
from app.auth import get_current_user

router = APIRouter(tags=["Alumnos"])

def obtener_ciclo_por_id(db: Session, ciclo_id: int) -> str:
    if not ciclo_id:
        return "No asignado"
    ciclo_db = db.query(models.Ciclo).filter(models.Ciclo.id == ciclo_id).first()
    return ciclo_db.nombre if ciclo_db else "No asignado"

def armar_dashboard(estado: str, tlf: str, ciclo: str, emp=None) -> dict:
    return {
        "estado": estado, "telefono": tlf, "ciclo": ciclo,
        "empresa": emp.nombre if emp else None,
        "direccion": emp.direccion if emp else None,
        "tutor_laboral": emp.persona_contacto if emp else None,
        "email_contacto": emp.email_tutor if emp else None
    }

@router.post("/alumnos/subir-cv")
async def subir_cv(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if file.content_type != "application/pdf": 
        raise HTTPException(status_code=400, detail="Solo PDF")
    os.makedirs("uploads", exist_ok=True) 
    file_location = f"uploads/cv_{current_user.id}.pdf"
    with open(file_location, "wb") as buffer: 
        shutil.copyfileobj(file.file, buffer)
    current_user.cv_path = file_location
    db.commit()
    return {"mensaje": "CV subido"}

@router.get("/alumno/dashboard", response_model=schemas.DashboardOut)
def ver_dashboard_alumno(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    asig = db.query(models.Asignacion).filter(models.Asignacion.alumno_id == current_user.id).first()
    id_ciclo = asig.ciclo_id if asig else current_user.ciclo_tutor_id
    ciclo_nombre = obtener_ciclo_por_id(db, id_ciclo)
    
    if not asig:
        return armar_dashboard("Pendiente", current_user.telefono, ciclo_nombre)
        
    emp = db.query(models.Empresa).filter(models.Empresa.id == asig.empresa_id).first()
    return armar_dashboard("Asignado", current_user.telefono, ciclo_nombre, emp)