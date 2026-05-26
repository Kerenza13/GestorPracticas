from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models, auth, crud
from app.database import get_db

router = APIRouter(tags=["Auth"])

@router.post("/register")
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.comprobar_email_existe(db, user_in.email):
        raise HTTPException(status_code=400, detail="El email ya existe")
    
    new_user = models.User(
        full_name=user_in.nombre, email=user_in.email, 
        hashed_password=auth.hash_password(user_in.password), role=user_in.role
    )
    db.add(new_user)
    db.commit()
    return {"mensaje": f"Usuario registrado como {user_in.role}"}

@router.post("/login")
def login(login_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.username).first()
    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
        
    token = auth.create_access_token(data={"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}