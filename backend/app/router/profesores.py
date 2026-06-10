from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import FileResponse
from app import models, schemas, crud
from app.database import get_db 
from app.auth import get_current_user

router = APIRouter(tags=["Profesores"])

@router.post("/alumnos/importar")
async def importar_alumnos(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": 
        raise HTTPException(status_code=403, detail="No tienes permiso")
    count = crud.procesar_csv_alumnos(db, await file.read())
    return {"mensaje": f"Importados {count} alumnos"}

@router.post("/empresas/importar")
async def importar_empresas(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": 
        raise HTTPException(status_code=403, detail="Solo profesores")
    count = crud.procesar_csv_empresas(db, await file.read())
    return {"mensaje": f"Importadas {count} empresas"}

@router.post("/asignar/")
def asignar_alumno(data: schemas.AsignacionRequest, db: Session = Depends(get_db)):
    ya_asig = db.query(models.Asignacion).filter(models.Asignacion.alumno_id == data.alumno_id, models.Asignacion.ciclo_id == data.ciclo_id).first()
    if ya_asig: 
        raise HTTPException(status_code=400, detail="Alumno ya asignado")
    if not crud.verificar_limite_plazas(db, data): 
        raise HTTPException(status_code=400, detail="Sin plazas")
        
    db.add(models.Asignacion(**data.model_dump()))
    db.commit()
    return {"mensaje": "Asignación completada"}

@router.post("/seguimiento/")
def registrar_seguimiento(data: schemas.SeguimientoCreate, db: Session = Depends(get_db)):
    nuevo = models.Seguimiento(empresa_id=data.empresa_id, profesor_id=data.profesor_id, observaciones=data.observaciones)
    db.add(nuevo)
    db.commit()
    return {"mensaje": "Contacto registrado"}

@router.get("/mis-alumnos/")
def obtener_mis_alumnos(profesor_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    id_buscar = profesor_id if profesor_id is not None else current_user.id
    profe = db.query(models.User).filter(models.User.id == id_buscar).first()
    if not profe:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    if profe.role == "admin": 
        return db.query(models.User).filter(models.User.role == "student").all()
    return db.query(models.User).join(models.Asignacion, models.Asignacion.alumno_id == models.User.id, isouter=True).filter(profe.ciclo_tutor_id == models.User.ciclo_tutor_id).all()

@router.get("/empresas/{empresa_id}/seguimientos")
def obtener_historial_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return db.query(models.Seguimiento).filter(models.Seguimiento.empresa_id == empresa_id).order_by(models.Seguimiento.fecha_contacto.desc()).all()

@router.get("/descargar-cv/{alumno_id}")
def descargar_cv(alumno_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    alumno = db.query(models.User).filter(models.User.id == alumno_id).first()
    if not alumno or not alumno.cv_path: 
        raise HTTPException(status_code=404, detail="Sin CV")
    return FileResponse(path=alumno.cv_path, filename=f"cv_{alumno.full_name}.pdf")

@router.get("/empresas/estado-plazas", response_model=List[schemas.PlazaResumen])
def ver_estado_plazas(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": 
        raise HTTPException(status_code=403, detail="No tienes permiso")
    resumen = []
    for e in db.query(models.Empresa).all():
        o = db.query(models.Asignacion).filter(models.Asignacion.empresa_id == e.id).count()
        resumen.append({"id": e.id, "nombre": e.nombre, "totales": e.plazas_disponibles, "libres": e.plazas_disponibles - o})
    return resumen