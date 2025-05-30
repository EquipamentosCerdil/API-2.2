# 🚀 Guia Rápido - API de Gestão de Equipamentos Médicos

## ⚡ Setup Rápido (5 minutos)

```bash
# 1. Clone/baixe o projeto
cd /app

# 2. Execute o script de setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Acesse a aplicação
# Frontend: http://localhost:3000
# Credenciais: admin/admin
```

## 🔧 Comandos Essenciais

### Gerenciar Serviços
```bash
# Verificar status
sudo supervisorctl status

# Reiniciar todos
sudo supervisorctl restart all

# Reiniciar individual
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Ver Logs
```bash
# Logs do backend
tail -f /var/log/supervisor/backend.*.log

# Logs do frontend
tail -f /var/log/supervisor/frontend.*.log

# Health check
curl http://localhost:8001/api/health
```

### Executar Testes
```bash
# Testes automatizados
python3 backend_test.py

# Testes via script
chmod +x scripts/test_api.sh
./scripts/test_api.sh
```

## 🌐 URLs Importantes

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend | http://localhost:3000 | Interface web principal |
| Backend API | http://localhost:8001/api | API REST |
| Health Check | http://localhost:8001/api/health | Status do sistema |
| Docs API | http://localhost:8001/docs | Documentação Swagger |

## 🔑 Credenciais Padrão

- **Usuário**: admin
- **Senha**: admin

## 📁 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `backend/server.py` | API FastAPI principal |
| `frontend/src/App.js` | Interface React principal |
| `backend/.env` | Configurações backend |
| `frontend/.env` | Configurações frontend |
| `DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md` | Documentação completa |

## 🔄 Fluxo de Desenvolvimento

### 1. Fazer Mudanças no Backend
```bash
# Editar código
nano backend/server.py

# Reiniciar serviço
sudo supervisorctl restart backend

# Testar
curl http://localhost:8001/api/health
```

### 2. Fazer Mudanças no Frontend
```bash
# Editar código
nano frontend/src/App.js

# O React tem hot reload automático
# Apenas salve o arquivo e veja as mudanças
```

### 3. Adicionar Nova Dependência

**Backend:**
```bash
cd backend
pip install nova-biblioteca
echo "nova-biblioteca>=1.0.0" >> requirements.txt
sudo supervisorctl restart backend
```

**Frontend:**
```bash
cd frontend
yarn add nova-biblioteca
sudo supervisorctl restart frontend
```

## 🐛 Resolução Rápida de Problemas

### Problema: Serviços não iniciam
```bash
sudo supervisorctl restart all
sudo supervisorctl status
```

### Problema: Erro de conexão frontend → backend
1. Verificar se backend está rodando: `curl http://localhost:8001/api/health`
2. Verificar CORS no browser (F12 → Console)
3. Verificar variável `REACT_APP_BACKEND_URL` em `frontend/.env`

### Problema: Erro de autenticação
1. Testar login: `curl -X POST http://localhost:8001/api/login -d "username=admin&password=admin"`
2. Verificar se token está sendo enviado (F12 → Network)

### Problema: MongoDB não conecta
```bash
# Verificar se está rodando
ps aux | grep mongo

# Testar conexão
mongo --eval "db.runCommand('ping')"
```

## 📊 Endpoints da API (Referência Rápida)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/login` | Login | ❌ |
| GET | `/api/me` | Info do usuário | ✅ |
| GET | `/api/health` | Status do sistema | ❌ |
| GET/POST | `/api/equipamentos` | CRUD equipamentos | ✅ |
| GET/POST | `/api/manutencoes` | CRUD manutenções | ✅ |
| GET | `/api/relatorios` | Relatórios | ✅ |
| GET | `/api/notificacoes` | Notificações | ✅ |

## 🎯 Próximos Passos Comuns

### Adicionar Nova Funcionalidade
1. **Backend**: Adicionar endpoint em `server.py`
2. **Frontend**: Adicionar interface em `App.js`
3. **Testar**: Executar `python3 backend_test.py`
4. **Documentar**: Atualizar esta documentação

### Preparar para Produção
1. Executar `chmod +x scripts/deploy.sh && ./scripts/deploy.sh`
2. Atualizar URLs nos arquivos `.env`
3. Configurar SSL/HTTPS
4. Configurar backup automático

## 📞 Suporte

**Documentação completa**: `DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md`

**Scripts úteis**:
- `scripts/setup.sh` - Configuração inicial
- `scripts/test_api.sh` - Testes automatizados
- `scripts/deploy.sh` - Deploy para produção

**Logs para debug**:
- Backend: `/var/log/supervisor/backend.*.log`
- Frontend: `/var/log/supervisor/frontend.*.log`

---

*Sistema de Gestão de Equipamentos Médicos v2.1*  
*Documentação atualizada em: 30/05/2024*