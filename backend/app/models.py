from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import enum

class Ciclo(Base):
    __tablename__ = "ciclos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    inicio = Column(Integer)
    fin = Column(Integer)

class UserRole(str, enum.Enum):
    admin = "admin"
    teacher = "teacher"
    student = "student"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, default=UserRole.student) # Por defecto es alumno
    ciclo_tutor_id = Column(Integer, ForeignKey("ciclos.id"), nullable=True)
    # Esto permite que un profesor tenga muchos seguimientos
    seguimientos_realizados = relationship("Seguimiento", back_populates="profesor")
    telefono = Column(String, nullable=True) # Para los datos de contacto
    cv_path = Column(String, nullable=True)  # Aquí guardaremos "/uploads/cv_juan.pdf"

class Empresa(Base):
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    direccion = Column(String)
    web = Column(String)
    persona_contacto = Column(String)
    email_tutor = Column(String)
    telefono = Column(String)
    responsable_legal_dni = Column(String) # Requisito del PDF
    plazas_disponibles = Column(Integer, default=1) # Para la gestión de plazas

class Asignacion(Base):
    __tablename__ = "asignaciones"
    id = Column(Integer, primary_key=True, index=True)
    alumno_id = Column(Integer, ForeignKey("users.id"))
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    ciclo_id = Column(Integer, ForeignKey("ciclos.id"))

    __table_args__ = (UniqueConstraint('alumno_id', 'ciclo_id', name='_alumno_ciclo_uc'),)

class Seguimiento(Base):
    __tablename__ = "seguimientos"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    profesor_id = Column(Integer, ForeignKey("users.id")) # Apunta a la tabla users
    
    fecha_contacto = Column(DateTime, default=datetime.utcnow)
    observaciones = Column(String)

    # Creamos la conexión "lógica"
    profesor = relationship("User", back_populates="seguimientos_realizados")
    empresa = relationship("Empresa")