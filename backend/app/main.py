from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import io
import shutil
import os

from app import models, database, auth, schemas
from app.database import engine, get_db 
from app.auth import get_current_user
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# Asegura que las tablas existan
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestión de Prácticas API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# --- 1. REGISTRO ---
@app.post("/register", tags=["Auth"])
def register(nombre: str, email: str, password: str, role: str = "student", db: Session = Depends(get_db)):
    user_exists = db.query(models.User).filter(models.User.email == email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="El email ya existe")
    new_user = models.User(full_name=nombre, email=email, hashed_password=auth.hash_password(password), role=role)
    db.add(new_user)
    db.commit()
    return {"mensaje": f"Usuario registrado como {role}"}

# --- 2. LOGIN ---
@app.post("/login", tags=["Auth"])
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.username).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    access_token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

# --- 3. CREAR CICLO ---
@app.post("/ciclos/", tags=["Admin"])
def crear_ciclo(ciclo: schemas.CicloCreate, db: Session = Depends(get_db)):
    nuevo_ciclo = models.Ciclo(**ciclo.model_dump())
    db.add(nuevo_ciclo)
    db.commit()
    return {"mensaje": "Ciclo creado correctamente"}

# --- 4. IMPORTAR ALUMNOS ---
@app.post("/alumnos/importar", tags=["Importación"])
async def importar_alumnos(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": raise HTTPException(status_code=403, detail="No tienes permiso")
    content = await file.read()
    reader = csv.reader(io.StringIO(content.decode('utf-8-sig')))
    contador = 0
    for row in reader:
        if not row or len(row) < 3: continue
        nombre, email, password = row
        if not db.query(models.User).filter(models.User.email == email.strip()).first():
            db.add(models.User(full_name=nombre.strip(), email=email.strip(), hashed_password=auth.hash_password(password.strip()), role="student"))
            contador += 1
    db.commit()
    return {"mensaje": f"Importados {contador} alumnos"}

# --- 5. IMPORTAR EMPRESAS ---
@app.post("/empresas/importar", tags=["Importación"])
async def importar_empresas(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": raise HTTPException(status_code=403, detail="Solo profesores")
    content = await file.read()
    reader = csv.reader(io.StringIO(content.decode('utf-8')))
    contador = 0
    for row in reader:
        try:
            nombre, direccion, web, contacto, email, tlf, dni, plazas = row
            if not db.query(models.Empresa).filter(models.Empresa.nombre == nombre.strip()).first():
                db.add(models.Empresa(nombre=nombre.strip(), direccion=direccion.strip(), web=web.strip(), persona_contacto=contacto.strip(), email_tutor=email.strip(), telefono=tlf.strip(), responsable_legal_dni=dni.strip(), plazas_disponibles=int(plazas.strip())))
                contador += 1
        except: continue
    db.commit()
    return {"mensaje": f"Importadas {contador} empresas"}

# --- 6. ASIGNAR ALUMNO A EMPRESA (Drag & Drop) ---
@app.post("/asignar/", tags=["Profesores"])
def asignar_alumno(data: schemas.AsignacionRequest, db: Session = Depends(get_db)):
    ya_asignado = db.query(models.Asignacion).filter(models.Asignacion.alumno_id == data.alumno_id, models.Asignacion.ciclo_id == data.ciclo_id).first()
    if ya_asignado: raise HTTPException(status_code=400, detail="Alumno ya asignado")
    empresa = db.query(models.Empresa).filter(models.Empresa.id == data.empresa_id).first()
    ocupadas = db.query(models.Asignacion).filter(models.Asignacion.empresa_id == data.empresa_id, models.Asignacion.ciclo_id == data.ciclo_id).count()
    if ocupadas >= empresa.plazas_disponibles: raise HTTPException(status_code=400, detail="Sin plazas")
    db.add(models.Asignacion(**data.model_dump()))
    db.commit()
    return {"mensaje": "Asignación completada"}

# --- 7. REGISTRAR SEGUIMIENTO ---
@app.post("/seguimiento/", tags=["Profesores"])
def registrar_seguimiento(data: schemas.SeguimientoCreate, db: Session = Depends(get_db)):
    nuevo_log = models.Seguimiento(empresa_id=data.empresa_id, profesor_id=data.profesor_id, observaciones=data.observaciones)
    db.add(nuevo_log)
    db.commit()
    return {"mensaje": "Contacto registrado"}

# --- 8. ASIGNAR CICLO A PROFESOR (Tutoría) ---
@app.put("/profesores/{profesor_id}/asignar-ciclo", tags=["Admin"])
def asignar_ciclo_a_profesor(profesor_id: int, ciclo_id: int, db: Session = Depends(get_db)):
    profesor = db.query(models.User).filter(models.User.id == profesor_id).first()
    if not profesor or profesor.role not in ["teacher", "admin"]: raise HTTPException(status_code=404, detail="Profe no encontrado")
    profesor.ciclo_tutor_id = ciclo_id
    db.commit()
    return {"mensaje": "Tutoría asignada"}

# --- 9. VER MIS ALUMNOS (Tutor) ---
@app.get("/mis-alumnos/", tags=["Profesores"])
def obtener_mis_alumnos(profesor_id: int, db: Session = Depends(get_db)):
    profe = db.query(models.User).filter(models.User.id == profesor_id).first()
    if profe.role == "admin": return db.query(models.User).filter(models.User.role == "student").all()
    return db.query(models.User).join(models.Asignacion).filter(models.Asignacion.ciclo_id == profe.ciclo_tutor_id).all()

# --- 10. HISTORIAL SEGUIMIENTO POR EMPRESA ---
@app.get("/empresas/{empresa_id}/seguimientos", tags=["Profesores"])
def obtener_historial_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return db.query(models.Seguimiento).filter(models.Seguimiento.empresa_id == empresa_id).order_by(models.Seguimiento.fecha_contacto.desc()).all()

# --- 11. SUBIR CV ---
@app.post("/alumnos/subir-cv", tags=["Alumnos"])
async def subir_cv(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if file.content_type != "application/pdf": raise HTTPException(status_code=400, detail="Solo PDF")
    os.makedirs("uploads", exist_ok=True) 
    file_location = f"uploads/cv_{current_user.id}.pdf"
    with open(file_location, "wb") as buffer: shutil.copyfileobj(file.file, buffer)
    current_user.cv_path = file_location
    db.commit()
    return {"mensaje": "CV subido"}

# --- 12. DASHBOARD ALUMNO ---
@app.get("/alumno/dashboard", response_model=schemas.DashboardOut, tags=["Alumnos"])
def ver_dashboard_alumno(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    asig = db.query(models.Asignacion).filter(models.Asignacion.alumno_id == current_user.id).first()
    if not asig: return {"estado": "Pendiente", "empresa": None, "direccion": None, "tutor_laboral": None, "email_contacto": None}
    emp = db.query(models.Empresa).filter(models.Empresa.id == asig.empresa_id).first()
    return {"estado": "Asignado", "empresa": emp.nombre, "direccion": emp.direccion, "tutor_laboral": emp.persona_contacto, "email_contacto": emp.email_tutor}

# --- 13. DESCARGAR CV ---
@app.get("/descargar-cv/{alumno_id}", tags=["Profesores"])
def descargar_cv(alumno_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    alumno = db.query(models.User).filter(models.User.id == alumno_id).first()
    if not alumno or not alumno.cv_path: raise HTTPException(status_code=404, detail="Sin CV")
    return FileResponse(path=alumno.cv_path, filename=f"cv_{alumno.full_name}.pdf")

# --- 14. ESTADO PLAZAS ---
@app.get("/empresas/estado-plazas", response_model=List[schemas.PlazaResumen], tags=["Profesores"])
def ver_estado_plazas(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher": raise HTTPException(status_code=403, detail="No tienes permiso")
    empresas = db.query(models.Empresa).all()
    resumen = []
    for e in empresas:
        ocupadas = db.query(models.Asignacion).filter(models.Asignacion.empresa_id == e.id).count()
        resumen.append({"id": e.id, "nombre": e.nombre, "totales": e.plazas_disponibles, "libres": e.plazas_disponibles - ocupadas})
    return resumen

# --- 15. VER SEGUIMIENTOS (Simplificado) ---
@app.get("/seguimientos/{empresa_id}", tags=["Profesores"])
def ver_seguimientos_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return db.query(models.Seguimiento).filter(models.Seguimiento.empresa_id == empresa_id).all()