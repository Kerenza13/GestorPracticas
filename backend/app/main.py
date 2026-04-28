from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, database, auth
# Importamos get_db directamente desde donde lo definimos
from app.database import engine, get_db 
import csv
import io
import shutil
import os
from fastapi import UploadFile, File
from app.auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# Crea las tablas automáticamente
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestión de Prácticas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción pondrías la URL del front, "*" es para desarrollo # Permite que React (en cualquier puerto) se conecte
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE
    allow_headers=["*"], # Permite enviar el Token JWT en las cabeceras
)

@app.post("/ciclos/")
def crear_ciclo(nombre: str, inicio: int, fin: int, db: Session = Depends(get_db)):
    nuevo_ciclo = models.Ciclo(nombre=nombre, inicio=inicio, fin=fin)
    db.add(nuevo_ciclo)
    db.commit()
    return {"mensaje": "Ciclo creado correctamente"}

# @app.post("/register/")
# def register_user(email: str, password: str, nombre: str, db: Session = Depends(get_db)):
#     hashed = auth.hash_password(password)
#     nuevo_usuario = models.User(email=email, hashed_password=hashed, full_name=nombre, role="admin")
#     db.add(nuevo_usuario)
#     db.commit()
#     return {"mensaje": "Usuario registrado con éxito"}

@app.post("/register")
def register(
    nombre: str, 
    email: str, 
    password: str, 
    role: str = "student", # Por defecto es estudiante, pero permite cambiarlo
    db: Session = Depends(get_db)
):
    # Comprobar si el email ya existe
    user_exists = db.query(models.User).filter(models.User.email == email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="El email ya existe")

    # Crear el usuario con el rol que enviemos (teacher o student)
    new_user = models.User(
        full_name=nombre,
        email=email,
        hashed_password=auth.hash_password(password), # Usa tu función de hash
        role=role 
    )
    db.add(new_user)
    db.commit()
    return {"mensaje": f"Usuario registrado como {role}"}

# @app.post("/login")
# def login(email: str, password: str, db: Session = Depends(get_db)):
#     # 1. Buscar al usuario por email
#     user = db.query(models.User).filter(models.User.email == email).first()
    
#     # 2. Comprobar si existe y si la contraseña coincide
#     if not user or not auth.verify_password(password, user.hashed_password):
#         return {"error": "Email o contraseña incorrectos"}
    
#     # 3. Si todo es OK, crear el Token JWT
#     # Metemos el email (sub) y su rol dentro del token
#     access_token = auth.create_access_token(
#         data={"sub": user.email, "role": user.role}
#     )
    
#     return {
#         "access_token": access_token, 
#         "token_type": "bearer",
#         "role": user.role
#     }

@app.post("/login")
# No pongas (email: str, password: str), usa form_data
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # 1. Buscamos por form_data.username (ahí viaja el email)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        # Es mejor levantar una excepción que devolver un diccionario con "error"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos"
        )
    
    # 2. Generar el token
    access_token = auth.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

# @app.post("/alumnos/importar")
# async def importar_alumnos(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     # 1. Leer el contenido del archivo subido
#     content = await file.read()
#     # 2. Decodificarlo a texto
#     decoded = content.decode('utf-8')
#     reader = csv.reader(io.StringIO(decoded))
    
#     contador = 0
#     for row in reader:
#         # Saltamos líneas vacías
#         if not row: continue
        
#         nombre, email, password = row
        
#         # Comprobar si ya existe para no duplicar
#         existe = db.query(models.User).filter(models.User.email == email).first()
#         if not existe:
#             # Importante: Usamos el hash_password que ya probamos que funciona
#             hashed = auth.hash_password(password)
#             nuevo_alumno = models.User(
#                 full_name=nombre, 
#                 email=email, 
#                 hashed_password=hashed, 
#                 role="student" # Todos entran como alumnos
#             )
#             db.add(nuevo_alumno)
#             contador += 1
            
#     db.commit()
#     return {"mensaje": f"Se han importado {contador} alumnos correctamente"}

@app.post("/alumnos/importar")
async def importar_alumnos(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="No tienes permiso")

    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.reader(io.StringIO(decoded))
    
    contador = 0
    for row in reader:
        if not row or len(row) < 3: continue # Evita errores si falta algún dato
        
        nombre_completo, email, password = row
        
        existe = db.query(models.User).filter(models.User.email == email).first()
        if not existe:
            # Aquí usamos el nombre que SÍ tienes en auth.py
            hashed = auth.hash_password(password.strip()) 
            
            nuevo_alumno = models.User(
                full_name=nombre_completo.strip(),
                email=email.strip(), 
                hashed_password=hashed, 
                role="student"
            )
            db.add(nuevo_alumno)
            contador += 1
            
    db.commit()
    return {"mensaje": f"Se han importado {contador} alumnos correctamente"}

@app.post("/empresas/importar")
async def importar_empresas(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # <--- EXIGIMOS LOGIN
):
    # 1. SEGURIDAD DE ROL: Solo el profesor/admin puede importar empresas
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Acceso denegado: Solo los profesores pueden cargar el catálogo de empresas"
        )

    # 2. Leer y procesar el archivo
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.reader(io.StringIO(decoded))
    
    contador = 0
    for row in reader:
        if not row: continue
        
        # Estructura del CSV esperada: 
        # nombre, direccion, web, contacto, email, tlf, dni_responsable
        try:
            nombre, direccion, web, contacto, email, tlf, dni, plazas = row
            
            # 3. Evitar duplicados (por nombre de empresa)
            existe = db.query(models.Empresa).filter(models.Empresa.nombre == nombre.strip()).first()
            
            if not existe:
                nueva_empresa = models.Empresa(
                    nombre=nombre.strip(),
                    direccion=direccion.strip(),
                    web=web.strip(),
                    persona_contacto=contacto.strip(),
                    email_tutor=email.strip(),
                    telefono=tlf.strip(),
                    responsable_legal_dni=dni.strip(),
                    plazas_disponibles=int(plazas.strip())
                )
                db.add(nueva_empresa)
                contador += 1
        except ValueError:
            # Si una línea no tiene todas las columnas, la saltamos para que no pete el bucle
            continue
            
    db.commit()
    return {"mensaje": f"Se han importado {contador} empresas correctamente"}

@app.post("/asignar/")
def asignar_alumno(alumno_id: int, empresa_id: int, ciclo_id: int, db: Session = Depends(get_db)):
# 1. Verificar si el alumno ya está asignado en este ciclo
    ya_asignado = db.query(models.Asignacion).filter(
        models.Asignacion.alumno_id == alumno_id,
        models.Asignacion.ciclo_id == ciclo_id
    ).first()
    if ya_asignado:
        raise HTTPException(status_code=400, detail="El alumno ya tiene asignación en este ciclo")

    # 2. Verificar disponibilidad de plazas en la empresa
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="La empresa no existe")

    plazas_ocupadas = db.query(models.Asignacion).filter(
        models.Asignacion.empresa_id == empresa_id,
        models.Asignacion.ciclo_id == ciclo_id
    ).count()

    if plazas_ocupadas >= empresa.plazas_disponibles:
        raise HTTPException(status_code=400, detail=f"La empresa {empresa.nombre} no tiene más plazas libres")

    # 3. Si todo está OK, asignamos
    nueva_asig = models.Asignacion(alumno_id=alumno_id, empresa_id=empresa_id, ciclo_id=ciclo_id)
    db.add(nueva_asig)
    db.commit()
    
    return {
        "mensaje": "Asignación completada",
        "plazas_restantes": empresa.plazas_disponibles - (plazas_ocupadas + 1)
    }

@app.post("/seguimiento/")
def registrar_seguimiento(empresa_id: int, profesor_id: int, comentario: str, db: Session = Depends(get_db)):
    nuevo_log = models.Seguimiento(
        empresa_id=empresa_id, 
        profesor_id=profesor_id, 
        observaciones=comentario
    )
    db.add(nuevo_log)
    db.commit()
    return {"mensaje": "Contacto registrado correctamente"}

@app.put("/profesores/{profesor_id}/asignar-ciclo")
def asignar_ciclo_a_profesor(profesor_id: int, ciclo_id: int, db: Session = Depends(get_db)):
    try:
        profesor = db.query(models.User).filter(models.User.id == profesor_id).first()
        
        if not profesor or profesor.role not in ["teacher", "admin"]:
            raise HTTPException(status_code=404, detail="Profesor no encontrado o rol no válido")
        
        ciclo = db.query(models.Ciclo).filter(models.Ciclo.id == ciclo_id).first()
        if not ciclo:
            raise HTTPException(status_code=404, detail="El ciclo no existe")

        profesor.ciclo_tutor_id = ciclo_id
        db.commit()
        db.refresh(profesor) # Refresca los datos para asegurar que se guardaron
        
        return {"mensaje": f"Profesor {profesor.full_name} asignado al ciclo {ciclo.nombre}"}
        
    except Exception as e:
        db.rollback() # Si algo falla, deshace el intento de guardado
        print(f"ERROR DETECTADO: {e}") # Esto saldrá en tu terminal de VS Code
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/mis-alumnos/")
def obtener_mis_alumnos(profesor_id: int, db: Session = Depends(get_db)):
    # 1. Buscamos al profesor para ver qué ciclo tiene asignado
    profe = db.query(models.User).filter(models.User.id == profesor_id).first()
    
    if profe.role == "admin":
        # El admin lo ve todo
        return db.query(models.User).filter(models.User.role == "student").all()
    
    if not profe.ciclo_tutor_id:
        raise HTTPException(status_code=400, detail="Este profesor no tiene un ciclo asignado")

    # 2. Buscamos alumnos que estén en su mismo ciclo (esto requiere que el alumno también tenga ciclo_id)
    # Por ahora, vamos a devolver los alumnos asignados a plazas de ese ciclo
    alumnos = db.query(models.User).join(models.Asignacion).filter(
        models.Asignacion.ciclo_id == profe.ciclo_tutor_id
    ).all()
    
    return alumnos

@app.get("/empresas/{empresa_id}/seguimientos")
def obtener_historial_empresa(empresa_id: int, db: Session = Depends(get_db)):
    # Buscamos todos los seguimientos de esa empresa, ordenados por fecha
    historial = db.query(models.Seguimiento).filter(
        models.Seguimiento.empresa_id == empresa_id
    ).order_by(models.Seguimiento.fecha_contacto.desc()).all()
    
    return historial    

@app.get("/seguimientos/{empresa_id}")
def ver_seguimientos_empresa(empresa_id: int, db: Session = Depends(get_db)):
    seguimientos = db.query(models.Seguimiento).filter(
        models.Seguimiento.empresa_id == empresa_id
    ).order_by(models.Seguimiento.fecha_contacto.desc()).all()
    
    if not seguimientos:
        return {"mensaje": "No hay contactos registrados para esta empresa todavía."}
    
    return seguimientos

@app.post("/alumnos/subir-cv")
async def subir_cv(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Validar que sea un PDF
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    # --- NUEVO: Crear la carpeta 'uploads' si no existe ---
    os.makedirs("uploads", exist_ok=True) 

    # 2. Crear la ruta del archivo usando el ID del usuario
    file_location = f"uploads/cv_{current_user.id}.pdf"

    # 3. Guardar el archivo físicamente
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        # Por si ocurre algún error de permisos en el sistema
        raise HTTPException(status_code=500, detail=f"Error al escribir el archivo: {str(e)}")

    # 4. Guardar la ruta en la Base de Datos
    current_user.cv_path = file_location
    db.commit()

    return {"mensaje": "Currículum subido con éxito", "ruta": file_location}

@app.get("/alumno/dashboard")
def ver_dashboard_alumno(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Buscamos si el alumno tiene alguna asignación
    asignacion = db.query(models.Asignacion).filter(
        models.Asignacion.alumno_id == current_user.id
    ).first()

    # 2. Si no tiene, devolvemos estado Pendiente
    if not asignacion:
        return {
            "estado": "Pendiente",
            "mensaje": "Aún no tienes una empresa asignada para las prácticas."
        }

    # 3. Si tiene, buscamos los datos de esa empresa
    empresa = db.query(models.Empresa).filter(models.Empresa.id == asignacion.empresa_id).first()

    return {
        "estado": "Asignado",
        "empresa": empresa.nombre,
        "direccion": empresa.direccion,
        "tutor_laboral": empresa.persona_contacto,
        "email_contacto": empresa.email_tutor
    }

@app.get("/descargar-cv/{alumno_id}")
def descargar_cv(
    alumno_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Buscar al alumno en la DB
    alumno = db.query(models.User).filter(models.User.id == alumno_id).first()

    if not alumno or not alumno.cv_path:
        raise HTTPException(status_code=404, detail="El alumno no tiene CV subido")

    # 2. Verificar que el archivo existe en la carpeta 'uploads'
    if not os.path.exists(alumno.cv_path):
        raise HTTPException(status_code=404, detail="Archivo físico no encontrado")

    # 3. Devolver el archivo para que el navegador lo descargue
    return FileResponse(
        path=alumno.cv_path, 
        filename=f"cv_{alumno.full_name}.pdf", 
        media_type='application/pdf'
    )

@app.get("/empresas/estado-plazas")
def ver_estado_plazas(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="No tienes permiso")
    
    empresas = db.query(models.Empresa).all()
    resumen = []
    for e in empresas:
        ocupadas = db.query(models.Asignacion).filter(models.Asignacion.empresa_id == e.id).count()
        resumen.append({
            "id": e.id,
            "nombre": e.nombre,
            "totales": e.plazas_disponibles,
            "libres": e.plazas_disponibles - ocupadas
        })
    return resumen