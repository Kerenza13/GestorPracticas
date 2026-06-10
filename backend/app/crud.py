import csv
import io
from sqlalchemy.orm import Session
from app import models, schemas, auth

def comprobar_email_existe(db: Session, email: str) -> bool:
    return db.query(models.User).filter(models.User.email == email.strip()).first() is not None

def crear_usuario_estudiante(db: Session, fila: list) -> bool:
    nombre, email, password, telefono = fila
    if comprobar_email_existe(db, email):
        return False
    nuevo = models.User(
        full_name=nombre.strip(), email=email.strip(),
        hashed_password=auth.hash_password(password.strip()),
        telefono=telefono.strip(), role="student"
    )
    db.add(nuevo)
    return True

def procesar_csv_alumnos(db: Session, contenido: bytes) -> int:
    reader = csv.reader(io.StringIO(contenido.decode('utf-8-sig')))
    contador = 0
    for row in reader:
        if row and len(row) >= 4 and crear_usuario_estudiante(db, row):
            contador += 1
    db.commit()
    return contador

def crear_empresa_individual(db: Session, fila: list) -> bool:
    nombre, direccion, web, contacto, email, tlf, dni, plazas = fila
    existente = db.query(models.Empresa).filter(models.Empresa.nombre == nombre.strip()).first()
    if existente:
        return False
    nueva = models.Empresa(
        nombre=nombre.strip(), direccion=direccion.strip(), web=web.strip(),
        persona_contacto=contacto.strip(), email_tutor=email.strip(),
        telefono=tlf.strip(), responsable_legal_dni=dni.strip(),
        plazas_disponibles=int(plazas.strip())
    )
    db.add(nueva)
    return True

def procesar_csv_empresas(db: Session, contenido: bytes) -> int:
    reader = csv.reader(io.StringIO(contenido.decode('utf-8')))
    contador = 0
    for row in reader:
        try:
            if crear_empresa_individual(db, row):
                contador += 1
        except Exception:
            continue
    db.commit()
    return contador

def verificar_limite_plazas(db: Session, req: schemas.AsignacionRequest) -> bool:
    emp = db.query(models.Empresa).filter(models.Empresa.id == req.empresa_id).first()
    ocupadas = db.query(models.Asignacion).filter(
        models.Asignacion.empresa_id == req.empresa_id,
        models.Asignacion.ciclo_id == req.ciclo_id
    ).count()
    return ocupadas < emp.plazas_disponibles if emp else False

def verificar_plazas_disponibles(db: Session, empresa_id: int, ciclo_id: int) -> bool:
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    ocupadas = db.query(models.Asignacion).filter(
        models.Asignacion.empresa_id == empresa_id, 
        models.Asignacion.ciclo_id == ciclo_id
    ).count()
    return ocupadas < empresa.plazas_disponibles

def crear_asignacion(db: Session, data: schemas.AsignacionRequest):
    nueva_asig = models.Asignacion(**data.model_dump())
    db.add(nueva_asig)
    db.commit()
    return nueva_asig