import sys
import os
from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import uuid
import uvicorn
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "sua_chave_secreta_para_jwt_equipamentos_medicos_2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

# Modelos para autenticação
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# Configuração de criptografia de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

# Inicialização da aplicação FastAPI
app = FastAPI(title="API de Gestão de Equipamentos Médicos", version="1.2")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Conexão com MongoDB
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'equipamentos_db')]

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Funções de autenticação
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        token_data = TokenData(username=username)
        return token_data
    except JWTError:
        return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = decode_access_token(token)
    if token_data is None:
        raise credentials_exception
    user = await db.users.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user=Depends(get_current_user)):
    if current_user.get("disabled"):
        raise HTTPException(status_code=400, detail="Usuário inativo")
    return current_user

# Endpoint de login
@api_router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verificar se o usuário existe
    user = await db.users.find_one({"username": form_data.username})
    
    # Se não existir e for o primeiro login com admin/admin, criar o usuário admin
    if not user and form_data.username == "admin" and form_data.password == "admin":
        # Criar usuário admin
        hashed_password = get_password_hash("admin")
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "username": "admin",
            "hashed_password": hashed_password,
            "disabled": False,
            "role": "admin",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        await db.users.insert_one(user)
        logger.info("Usuário admin criado com sucesso")
        
        # Criar token de acesso
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    # Verificar credenciais para usuário existente
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar senha para admin (simplificado) ou hash para outros usuários
    if user["username"] == "admin":
        if form_data.password != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha incorreta",
                headers={"WWW-Authenticate": "Bearer"},
            )
    else:
        if not verify_password(form_data.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Senha incorreta",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    # Criar token de acesso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint de informações do usuário atual
@api_router.get("/me", tags=["Usuários"])
async def read_users_me(current_user=Depends(get_current_active_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "role": current_user.get("role", "user"),
        "disabled": current_user.get("disabled", False)
    }

# Endpoint de health check
@api_router.get("/health", tags=["Sistema"])
async def health_check():
    try:
        # Testar conexão com MongoDB
        await client.admin.command('ping')
        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "disconnected",
            "error": str(e)
        }

# Endpoints para equipamentos
@api_router.get("/equipamentos", tags=["Equipamentos"])
async def listar_equipamentos(current_user=Depends(get_current_active_user)):
    try:
        equipamentos = await db.equipamentos.find().to_list(1000)
        # Converter ObjectId para string se necessário
        for equipamento in equipamentos:
            if "_id" in equipamento:
                del equipamento["_id"]
        return {"equipamentos": equipamentos, "total": len(equipamentos)}
    except Exception as e:
        logger.error(f"Erro ao listar equipamentos: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@api_router.post("/equipamentos", tags=["Equipamentos"], status_code=201)
async def criar_equipamento(equipamento: dict, current_user=Depends(get_current_active_user)):
    try:
        equipamento["id"] = str(uuid.uuid4())
        equipamento["created_at"] = datetime.utcnow()
        equipamento["updated_at"] = datetime.utcnow()
        equipamento["created_by"] = current_user["username"]
        await db.equipamentos.insert_one(equipamento)
        
        # Remover _id do MongoDB antes de retornar
        if "_id" in equipamento:
            del equipamento["_id"]
        
        return {"message": "Equipamento criado com sucesso", "equipamento": equipamento}
    except Exception as e:
        logger.error(f"Erro ao criar equipamento: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

# Endpoints para manutenções
@api_router.get("/manutencoes", tags=["Manutenções"])
async def listar_manutencoes(current_user=Depends(get_current_active_user)):
    try:
        manutencoes = await db.manutencoes.find().to_list(1000)
        for manutencao in manutencoes:
            if "_id" in manutencao:
                del manutencao["_id"]
        return {"manutencoes": manutencoes, "total": len(manutencoes)}
    except Exception as e:
        logger.error(f"Erro ao listar manutenções: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@api_router.post("/manutencoes", tags=["Manutenções"], status_code=201)
async def criar_manutencao(manutencao: dict, current_user=Depends(get_current_active_user)):
    try:
        manutencao["id"] = str(uuid.uuid4())
        manutencao["created_at"] = datetime.utcnow()
        manutencao["updated_at"] = datetime.utcnow()
        manutencao["created_by"] = current_user["username"]
        await db.manutencoes.insert_one(manutencao)
        
        if "_id" in manutencao:
            del manutencao["_id"]
        
        return {"message": "Manutenção criada com sucesso", "manutencao": manutencao}
    except Exception as e:
        logger.error(f"Erro ao criar manutenção: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

# Endpoints para relatórios
@api_router.get("/relatorios", tags=["Relatórios"])
async def listar_relatorios(current_user=Depends(get_current_active_user)):
    try:
        # Gerar relatório básico com estatísticas
        total_equipamentos = await db.equipamentos.count_documents({})
        total_manutencoes = await db.manutencoes.count_documents({})
        manutencoes_pendentes = await db.manutencoes.count_documents({"status": "pendente"})
        manutencoes_concluidas = await db.manutencoes.count_documents({"status": "concluida"})
        
        return {
            "relatorio": {
                "equipamentos": {
                    "total": total_equipamentos
                },
                "manutencoes": {
                    "total": total_manutencoes,
                    "pendentes": manutencoes_pendentes,
                    "concluidas": manutencoes_concluidas
                },
                "gerado_em": datetime.utcnow().isoformat(),
                "gerado_por": current_user["username"]
            }
        }
    except Exception as e:
        logger.error(f"Erro ao gerar relatório: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

# Endpoint para notificações
@api_router.get("/notificacoes", tags=["Notificações"])
async def listar_notificacoes(current_user=Depends(get_current_active_user)):
    try:
        # Buscar manutenções vencidas ou próximas do vencimento
        hoje = datetime.utcnow()
        proxima_semana = hoje + timedelta(days=7)
        
        manutencoes_vencidas = await db.manutencoes.find({
            "data_prevista": {"$lt": hoje},
            "status": {"$ne": "concluida"}
        }).to_list(100)
        
        manutencoes_proximas = await db.manutencoes.find({
            "data_prevista": {"$gte": hoje, "$lte": proxima_semana},
            "status": {"$ne": "concluida"}
        }).to_list(100)
        
        notificacoes = []
        
        for manutencao in manutencoes_vencidas:
            if "_id" in manutencao:
                del manutencao["_id"]
            notificacoes.append({
                "id": str(uuid.uuid4()),
                "tipo": "vencida",
                "titulo": "Manutenção Vencida",
                "mensagem": f"A manutenção {manutencao.get('id', 'N/A')} está vencida",
                "data": manutencao.get("data_prevista", hoje),
                "prioridade": "alta"
            })
        
        for manutencao in manutencoes_proximas:
            if "_id" in manutencao:
                del manutencao["_id"]
            notificacoes.append({
                "id": str(uuid.uuid4()),
                "tipo": "proxima",
                "titulo": "Manutenção Próxima",
                "mensagem": f"A manutenção {manutencao.get('id', 'N/A')} está próxima do vencimento",
                "data": manutencao.get("data_prevista", hoje),
                "prioridade": "media"
            })
        
        return {"notificacoes": notificacoes, "total": len(notificacoes)}
    except Exception as e:
        logger.error(f"Erro ao listar notificações: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
