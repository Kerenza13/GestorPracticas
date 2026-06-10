from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, models
from app.database import get_db

router = APIRouter(tags=["Admin"])

@router.post("/ciclos/")
def crear_ciclo(ciclo: schemas.CicloCreate, db: Session = Depends(get_db)):
    nuevo_ciclo = models.Ciclo(**ciclo.model_dump())
    db.add(nuevo_ciclo)
    db.commit()
    return {"mensaje": "Ciclo creado correctamente"}

@router.get("/ciclos/")
def obtener_ciclos(db: Session = Depends(get_db)):
    return db.query(models.Ciclo).all()

@router.put("/profesores/{profesor_id}/asignar-ciclo")
def asignar_ciclo_a_profesor(profesor_id: int, ciclo_id: int, db: Session = Depends(get_db)):
    profesor = db.query(models.User).filter(models.User.id == profesor_id).first()
    if not profesor or profesor.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=404, detail="Profe no encontrado")
        
    profesor.ciclo_tutor_id = ciclo_id
    db.commit()
    return {"mensaje": "Tutoría asignada"}