# 🏥 Documentação - API de Gestão de Equipamentos Médicos

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura Técnica](#arquitetura-técnica)
- [Configuração e Instalação](#configuração-e-instalação)
- [Problemas Encontrados e Soluções](#problemas-encontrados-e-soluções)
- [Processo de Implementação](#processo-de-implementação)
- [Documentação da API](#documentação-da-api)
- [Testes Realizados](#testes-realizados)
- [Como Continuar o Desenvolvimento](#como-continuar-o-desenvolvimento)
- [Melhorias Futuras](#melhorias-futuras)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

### O que é o Sistema?
A **API de Gestão de Equipamentos Médicos** é um sistema completo desenvolvido para hospitais, clínicas e empresas de manutenção de equipamentos médicos. O sistema permite o controle total do ciclo de vida dos equipamentos, desde o cadastro até o agendamento e acompanhamento de manutenções.

### Problema que Resolve
- **Controle de Inventário**: Rastreamento completo de equipamentos médicos
- **Gestão de Manutenções**: Agendamento e controle de manutenções preventivas e corretivas
- **Compliance Regulatório**: Atendimento às exigências de manutenção de equipamentos médicos
- **Relatórios Gerenciais**: Estatísticas em tempo real para tomada de decisões
- **Alertas Automáticos**: Notificações para manutenções vencidas ou próximas

### Público-Alvo
- Hospitais e clínicas
- Empresas de manutenção de equipamentos médicos
- Gestores de engenharia clínica
- Departamentos de compliance

---

## ⚙️ Funcionalidades

### 🔐 Sistema de Autenticação
- **Login seguro** com JWT (JSON Web Tokens)
- **Credenciais padrão**: admin/admin (criação automática no primeiro acesso)
- **Expiração de token**: 24 horas
- **Proteção de rotas**: Todas as operações requerem autenticação

### 🔧 Gestão de Equipamentos
- **Cadastro completo** de equipamentos médicos
  - Nome do equipamento
  - Modelo e fabricante
  - Número de série
  - Localização no hospital/clínica
  - Status (operacional/não operacional)
- **Listagem** com visualização em cards
- **Busca e filtros** (implementação futura)

### 🛠️ Gestão de Manutenções
- **Tipos de manutenção**:
  - Preventiva (programada)
  - Corretiva (quando quebra)
- **Controle de status**:
  - Pendente
  - Concluída
- **Agendamento** com data prevista
- **Vinculação** com equipamentos específicos
- **Descrições detalhadas** das manutenções

### 📊 Sistema de Relatórios
- **Estatísticas em tempo real**:
  - Total de equipamentos cadastrados
  - Total de manutenções agendadas
  - Manutenções pendentes vs concluídas
- **Metadados do relatório**:
  - Data/hora de geração
  - Usuário que gerou

### 🔔 Sistema de Notificações
- **Alertas automáticos**:
  - Manutenções vencidas (prioridade alta)
  - Manutenções próximas - próximos 7 dias (prioridade média)
- **Sistema de prioridades** visual
- **Integração futura** com email/SMS

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

#### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Banco de Dados**: MongoDB com Motor (driver assíncrono)
- **Autenticação**: JWT com python-jose
- **Segurança**: bcrypt para hash de senhas
- **CORS**: Configurado para integração frontend

#### Frontend
- **Framework**: React 19
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router
- **HTTP Client**: Axios
- **Estado**: React Hooks (useState, useEffect)

#### Infraestrutura
- **Processo Manager**: Supervisor
- **Servidor Web**: Uvicorn (desenvolvimento)
- **Container**: Kubernetes (produção)

### Estrutura de Diretórios
```
/app/
├── backend/
│   ├── server.py              # Aplicação FastAPI principal
│   ├── requirements.txt       # Dependências Python
│   └── .env                   # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── App.js            # Componente principal React
│   │   ├── App.css           # Estilos personalizados
│   │   └── index.js          # Entry point
│   ├── package.json          # Dependências Node.js
│   └── .env                  # Variáveis de ambiente
├── analysis-repo/            # Repositório clonado para análise
└── DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md
```

### Banco de Dados - Collections

#### Collection: `users`
```javascript
{
  "id": "uuid4",
  "username": "string",
  "hashed_password": "bcrypt_hash",
  "disabled": false,
  "role": "admin|user",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Collection: `equipamentos`
```javascript
{
  "id": "uuid4",
  "nome": "string",
  "modelo": "string",
  "fabricante": "string",
  "numero_serie": "string",
  "localizacao": "string",
  "status": "operacional|nao_operacional",
  "created_at": "datetime",
  "updated_at": "datetime",
  "created_by": "username"
}
```

#### Collection: `manutencoes`
```javascript
{
  "id": "uuid4",
  "equipamento_id": "uuid4",
  "tipo": "preventiva|corretiva",
  "descricao": "string",
  "data_prevista": "datetime",
  "status": "pendente|concluida",
  "created_at": "datetime",
  "updated_at": "datetime",
  "created_by": "username"
}
```

---

## 🚀 Configuração e Instalação

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- MongoDB
- Supervisor

### Variáveis de Ambiente

#### Backend (.env)
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="equipamentos_db"
SECRET_KEY="sua_chave_secreta_para_jwt_equipamentos_medicos_2024"
```

#### Frontend (.env)
```bash
WDS_SOCKET_PORT=443
REACT_APP_BACKEND_URL=https://seu-dominio.com
```

### Instalação Passo a Passo

#### 1. Backend
```bash
cd /app/backend
pip install -r requirements.txt
```

#### 2. Frontend
```bash
cd /app/frontend
yarn install  # IMPORTANTE: Usar yarn, não npm
```

#### 3. Iniciar Serviços
```bash
sudo supervisorctl restart all
sudo supervisorctl status  # Verificar se todos estão RUNNING
```

#### 4. Verificar Funcionamento
```bash
# Health check
curl http://localhost:8001/api/health

# Login
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin"
```

---

## 🐛 Problemas Encontrados e Soluções

### 1. Dependências Python
**Problema**: Algumas bibliotecas não estavam instaladas
**Solução**: Adicionei todas as dependências necessárias no requirements.txt:
```txt
fastapi==0.110.1
uvicorn==0.25.0
motor==3.3.1
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
python-dotenv>=1.0.1
pymongo==4.5.0
```

### 2. CORS Configuration
**Problema**: Frontend não conseguia acessar o backend
**Solução**: Configurei CORS adequadamente no FastAPI:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

### 3. MongoDB ObjectID
**Problema**: ObjectIDs do MongoDB não são serializáveis em JSON
**Solução**: Usei UUIDs em vez de ObjectIDs para facilitar serialização:
```python
equipamento["id"] = str(uuid.uuid4())
# Remove _id do MongoDB antes de retornar
if "_id" in equipamento:
    del equipamento["_id"]
```

### 4. Roteamento de API
**Problema**: URLs não estavam sendo redirecionadas corretamente
**Solução**: Usei APIRouter com prefixo '/api' para compatibilidade com Kubernetes:
```python
api_router = APIRouter(prefix="/api")
app.include_router(api_router)
```

### 5. Autenticação OAuth2
**Problema**: FastAPI esperava form data para OAuth2PasswordRequestForm
**Solução**: Configurei o frontend para enviar dados como form-urlencoded:
```javascript
const formData = new FormData();
formData.append('username', username);
formData.append('password', password);
```

### 6. Data Handling
**Problema**: Datas não estavam sendo tratadas corretamente
**Solução**: Implementei conversão adequada de strings para ISO datetime:
```javascript
const data = {
  ...maintenanceData,
  data_prevista: new Date(maintenanceData.data_prevista).toISOString()
};
```

---

## 📝 Processo de Implementação

### Fase 1: Análise do Repositório Original
1. **Clone do repositório**: https://github.com/EquipamentosCerdil/API-2.1.git
2. **Análise de arquivos**: Entendi a estrutura e funcionalidades
3. **Identificação de tecnologias**: FastAPI, React, MongoDB
4. **Mapeamento de endpoints**: Documentei todas as rotas disponíveis

### Fase 2: Configuração do Backend
1. **Migração do código**: Adaptei server.py para o ambiente atual
2. **Instalação de dependências**: requirements.txt atualizado
3. **Configuração de autenticação**: JWT com criação automática de admin
4. **Setup do MongoDB**: Conexão e collections configuradas
5. **Implementação de endpoints**: Todas as 9 rotas principais

### Fase 3: Desenvolvimento do Frontend
1. **Interface de login**: Tela com credenciais padrão
2. **Dashboard principal**: Navegação por abas
3. **Modais de cadastro**: Equipamentos e manutenções
4. **Sistema de mensagens**: Feedback visual para usuário
5. **Integração com API**: Axios configurado com interceptors

### Fase 4: Integração e Testes
1. **Configuração de variáveis**: .env files adequados
2. **Restart de serviços**: Supervisor configurado
3. **Testes de API**: Curl para validar endpoints
4. **Testes de interface**: Deep testing cloud
5. **Validação end-to-end**: Fluxo completo funcionando

---

## 📚 Documentação da API

### Base URL
```
Desenvolvimento: http://localhost:8001/api
Produção: https://seu-dominio.com/api
```

### Endpoints Disponíveis

#### 🔐 Autenticação

**POST /api/login**
```bash
# Request (form-urlencoded)
username=admin&password=admin

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**GET /api/me**
```bash
# Headers
Authorization: Bearer {token}

# Response
{
  "id": "uuid",
  "username": "admin",
  "role": "admin",
  "disabled": false
}
```

#### 🏥 Equipamentos

**GET /api/equipamentos**
```bash
# Headers
Authorization: Bearer {token}

# Response
{
  "equipamentos": [
    {
      "id": "uuid",
      "nome": "Ventilador Pulmonar",
      "modelo": "VP-2000",
      "fabricante": "MedTech",
      "numero_serie": "MT2024001",
      "localizacao": "UTI - Leito 5",
      "status": "operacional",
      "created_at": "2024-05-30T17:16:47.386000",
      "created_by": "admin"
    }
  ],
  "total": 1
}
```

**POST /api/equipamentos**
```bash
# Headers
Authorization: Bearer {token}
Content-Type: application/json

# Request Body
{
  "nome": "Desfibrilador",
  "modelo": "DEA-300",
  "fabricante": "Philips",
  "numero_serie": "SN12345",
  "localizacao": "Sala de Emergência",
  "status": "operacional"
}

# Response
{
  "message": "Equipamento criado com sucesso",
  "equipamento": {
    "id": "uuid",
    "nome": "Desfibrilador",
    // ... outros campos
  }
}
```

#### 🛠️ Manutenções

**GET /api/manutencoes**
```bash
# Headers
Authorization: Bearer {token}

# Response
{
  "manutencoes": [
    {
      "id": "uuid",
      "equipamento_id": "uuid",
      "tipo": "preventiva",
      "descricao": "Revisão trimestral completa",
      "data_prevista": "2025-06-15T10:00:00.000Z",
      "status": "pendente",
      "created_at": "2024-05-30T17:16:55.063000",
      "created_by": "admin"
    }
  ],
  "total": 1
}
```

**POST /api/manutencoes**
```bash
# Headers
Authorization: Bearer {token}
Content-Type: application/json

# Request Body
{
  "equipamento_id": "uuid",
  "tipo": "preventiva",
  "descricao": "Manutenção preventiva semestral",
  "data_prevista": "2025-06-15T10:00:00.000Z",
  "status": "pendente"
}
```

#### 📊 Relatórios

**GET /api/relatorios**
```bash
# Headers
Authorization: Bearer {token}

# Response
{
  "relatorio": {
    "equipamentos": {
      "total": 3
    },
    "manutencoes": {
      "total": 5,
      "pendentes": 3,
      "concluidas": 2
    },
    "gerado_em": "2024-05-30T17:16:55.112958",
    "gerado_por": "admin"
  }
}
```

#### 🔔 Notificações

**GET /api/notificacoes**
```bash
# Headers
Authorization: Bearer {token}

# Response
{
  "notificacoes": [
    {
      "id": "uuid",
      "tipo": "vencida",
      "titulo": "Manutenção Vencida",
      "mensagem": "A manutenção do equipamento X está vencida",
      "data": "2024-05-30T17:16:55.000Z",
      "prioridade": "alta"
    }
  ],
  "total": 1
}
```

#### ❤️ Health Check

**GET /api/health**
```bash
# Response
{
  "status": "ok",
  "timestamp": "2024-05-30T17:16:28.633410",
  "database": "connected"
}
```

---

## 🧪 Testes Realizados

### Testes de Backend (API)
✅ **Login com credenciais válidas**: admin/admin  
✅ **Login com credenciais inválidas**: retorna 401  
✅ **Criação de equipamento**: Ventilador Pulmonar  
✅ **Listagem de equipamentos**: retorna array com dados  
✅ **Criação de manutenção**: preventiva agendada  
✅ **Listagem de manutenções**: retorna array com dados  
✅ **Geração de relatórios**: estatísticas corretas  
✅ **Sistema de notificações**: algoritmo de alertas  
✅ **Health check**: conexão com MongoDB  

### Testes de Frontend (Interface)
✅ **Página de login**: carrega corretamente  
✅ **Autenticação**: funciona com admin/admin  
✅ **Dashboard**: carrega com nome do usuário  
✅ **Navegação**: entre 4 abas funciona  
✅ **Lista de equipamentos**: exibe cards corretamente  
✅ **Modal de equipamento**: abre e salva dados  
✅ **Lista de manutenções**: exibe informações corretas  
✅ **Aba de relatórios**: mostra estatísticas atualizadas  
✅ **Sistema de logout**: funcional  

### Ferramentas de Teste Criadas
- **backend_test.py**: Script Python para testes automatizados de API
- **Deep Testing Cloud**: Validação end-to-end com interface

---

## 🔄 Como Continuar o Desenvolvimento

### 1. Setup do Ambiente
```bash
# 1. Clone ou baixe o projeto
git clone <seu-repositorio>

# 2. Configure as variáveis de ambiente
# Edite /app/backend/.env e /app/frontend/.env

# 3. Instale dependências
cd /app/backend && pip install -r requirements.txt
cd /app/frontend && yarn install

# 4. Inicie os serviços
sudo supervisorctl restart all

# 5. Verifique se está funcionando
curl http://localhost:8001/api/health
```

### 2. Estrutura para Novas Funcionalidades

#### Backend (FastAPI)
```python
# Em /app/backend/server.py

# 1. Adicione novos modelos Pydantic
class NovoRecurso(BaseModel):
    campo1: str
    campo2: int

# 2. Crie novos endpoints
@api_router.post("/novo-recurso", tags=["Novo Recurso"])
async def criar_novo_recurso(
    data: NovoRecurso, 
    current_user=Depends(get_current_active_user)
):
    # Lógica aqui
    pass

# 3. Adicione validações e tratamento de erros
# 4. Documente no docstring
```

#### Frontend (React)
```javascript
// Em /app/frontend/src/App.js

// 1. Adicione novo estado
const [novoRecurso, setNovoRecurso] = useState([]);

// 2. Crie função para chamar API
const carregarNovoRecurso = async () => {
  const response = await apiClient.get('/novo-recurso');
  setNovoRecurso(response.data);
};

// 3. Adicione nova aba
<button onClick={() => setActiveTab('novo-recurso')}>
  Novo Recurso
</button>

// 4. Implemente o conteúdo da aba
{activeTab === 'novo-recurso' && (
  <div>
    {/* Seu componente aqui */}
  </div>
)}
```

### 3. Padrões de Desenvolvimento

#### Convenções de Código
- **Backend**: snake_case para variáveis e funções
- **Frontend**: camelCase para JavaScript
- **Database**: UUIDs para IDs, não ObjectIDs do MongoDB
- **API**: Sempre prefixar rotas com '/api'
- **Autenticação**: Verificar current_user em endpoints protegidos

#### Estrutura de Resposta da API
```python
# Sucesso
return {
    "message": "Operação realizada com sucesso",
    "data": resultado,
    "timestamp": datetime.utcnow().isoformat()
}

# Erro
raise HTTPException(
    status_code=400,
    detail="Descrição do erro"
)
```

#### Tratamento de Erros no Frontend
```javascript
try {
  const response = await apiClient.post('/endpoint', data);
  showMessage('Sucesso!', 'success');
} catch (error) {
  console.error('Erro:', error);
  showMessage('Erro na operação', 'error');
}
```

---

## 🚀 Melhorias Futuras

### Funcionalidades de Curto Prazo
1. **Busca e Filtros**
   - Busca por nome de equipamento
   - Filtros por fabricante, localização, status
   - Paginação para grandes volumes

2. **Histórico de Manutenções**
   - Log completo de manutenções realizadas
   - Anexos de documentos/fotos
   - Relatórios por período

3. **Dashboard Avançado**
   - Gráficos de manutenções por mês
   - Indicadores de performance (KPIs)
   - Widgets configuráveis

### Funcionalidades de Médio Prazo
1. **Sistema de Usuários Avançado**
   - Múltiplos níveis de acesso (admin, técnico, visualizador)
   - Registro de novos usuários
   - Auditoria de ações

2. **Notificações Avançadas**
   - Integração com email (SMTP)
   - Notificações push
   - Configuração de frequência de alertas

3. **Relatórios Avançados**
   - Exportação para PDF/Excel
   - Relatórios customizáveis
   - Agendamento de relatórios

### Funcionalidades de Longo Prazo
1. **Mobile App**
   - React Native ou Flutter
   - Sincronização offline
   - Scanner de QR Code para equipamentos

2. **Integração com ERP**
   - APIs para sistemas hospitalares
   - Sincronização de inventário
   - Workflow de aprovação

3. **Inteligência Artificial**
   - Predição de falhas
   - Otimização de cronogramas de manutenção
   - Análise de padrões

---

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Serviços não iniciam
```bash
# Verificar status
sudo supervisorctl status

# Ver logs de erro
tail -n 50 /var/log/supervisor/backend.err.log
tail -n 50 /var/log/supervisor/frontend.err.log

# Reiniciar serviços
sudo supervisorctl restart all
```

#### 2. Erro de conexão com MongoDB
```bash
# Verificar se MongoDB está rodando
ps aux | grep mongo

# Testar conexão
mongo --eval "db.runCommand('ping')"

# Verificar variável de ambiente
cat /app/backend/.env | grep MONGO_URL
```

#### 3. Frontend não consegue acessar Backend
```bash
# Verificar se backend está respondendo
curl http://localhost:8001/api/health

# Verificar CORS no browser (F12 → Console)
# Verificar variável REACT_APP_BACKEND_URL
cat /app/frontend/.env | grep REACT_APP_BACKEND_URL
```

#### 4. Erro de autenticação
```bash
# Testar login manualmente
curl -X POST http://localhost:8001/api/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin"

# Verificar se token está sendo enviado no frontend
# F12 → Network → Headers → Authorization
```

#### 5. Dependências faltando
```bash
# Backend
cd /app/backend
pip install -r requirements.txt

# Frontend
cd /app/frontend
yarn install  # NÃO use npm install
```

### Logs Importantes
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
tail -f /var/log/supervisor/frontend.err.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Comandos Úteis
```bash
# Restart específico
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# Ver processos rodando
ps aux | grep python  # Backend
ps aux | grep node    # Frontend

# Testar conectividade
curl -I http://localhost:8001/api/health  # Backend
curl -I http://localhost:3000             # Frontend
```

---

## 📞 Suporte e Contato

### Informações do Projeto
- **Versão**: 2.1
- **Data de Implementação**: 30/05/2024
- **Repositório Original**: https://github.com/EquipamentosCerdil/API-2.1.git
- **Status**: ✅ Funcional e Testado

### Para Dúvidas Técnicas
1. **Consulte esta documentação** primeiro
2. **Verifique os logs** em `/var/log/supervisor/`
3. **Execute o script de teste** `python backend_test.py`
4. **Teste endpoints manualmente** com curl

### Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin
- **Database**: equipamentos_db
- **Porta Backend**: 8001
- **Porta Frontend**: 3000

---

**🎉 Sistema 100% Funcional e Documentado! 🎉**

*Desenvolvido com ❤️ para gestão eficiente de equipamentos médicos*