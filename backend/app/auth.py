from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from app import models  # Asegúrate de que la ruta a models sea correcta
from app.database import get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta  # <--- ESTO ES LO QUE FALTA

# Configuración secreta (¡No la compartas!)
SECRET_KEY = "mi_clave_super_secreta_123"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# 2. La función que te falta (CÓPIALA TAL CUAL)
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print(f"DEBUG: El token recibido es: {token}")
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo validar el usuario",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

def hash_password(password: str):
    # Aseguramos que sea string, pero passlib necesita bytes internamente
    # El recorte lo hacemos por si acaso, pero el error venía del test interno
    return pwd_context.hash(password[:72])

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30) # El token dura 30 min
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)