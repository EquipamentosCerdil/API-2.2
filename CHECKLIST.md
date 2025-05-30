# ✅ Checklist - API de Gestão de Equipamentos Médicos

## 📋 Checklist de Configuração Inicial

### ⚙️ Ambiente e Dependências
- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado  
- [ ] Yarn instalado (não usar npm)
- [ ] MongoDB rodando
- [ ] Supervisor configurado

### 📁 Arquivos de Configuração
- [ ] `/app/backend/.env` existe e está correto
- [ ] `/app/frontend/.env` existe e está correto
- [ ] `/app/backend/requirements.txt` atualizado
- [ ] `/app/frontend/package.json` atualizado

### 🔧 Dependências Instaladas
- [ ] Dependências Python: `pip install -r backend/requirements.txt`
- [ ] Dependências Node.js: `cd frontend && yarn install`

### 🚀 Serviços Funcionando
- [ ] Backend rodando na porta 8001
- [ ] Frontend rodando na porta 3000
- [ ] MongoDB conectado
- [ ] Health check respondendo: `curl http://localhost:8001/api/health`

---

## 🧪 Checklist de Testes

### 🔐 Autenticação
- [ ] Login com admin/admin funciona
- [ ] Token JWT é gerado corretamente
- [ ] Proteção de rotas funciona
- [ ] Logout funciona

### 🏥 Funcionalidades Core
- [ ] Criar equipamento via API
- [ ] Listar equipamentos via API
- [ ] Criar manutenção via API
- [ ] Listar manutenções via API
- [ ] Gerar relatórios
- [ ] Obter notificações

### 🌐 Interface Web
- [ ] Página de login carrega
- [ ] Dashboard carrega após login
- [ ] Navegação entre abas funciona
- [ ] Modal de equipamentos abre/fecha
- [ ] Modal de manutenções abre/fecha
- [ ] Dados são exibidos corretamente

### 🔄 Integração Frontend ↔ Backend
- [ ] Frontend consegue fazer login
- [ ] Equipamentos criados aparecem na interface
- [ ] Manutenções criadas aparecem na interface
- [ ] Relatórios são atualizados em tempo real
- [ ] Mensagens de erro/sucesso funcionam

---

## 🚀 Checklist de Deploy para Produção

### 🔒 Segurança
- [ ] Alterar SECRET_KEY no backend/.env
- [ ] Remover credenciais padrão admin/admin
- [ ] Configurar HTTPS
- [ ] Configurar CORS adequadamente
- [ ] Validar todas as entradas da API

### 🌐 URLs e Ambiente
- [ ] Atualizar REACT_APP_BACKEND_URL para URL de produção
- [ ] Atualizar MONGO_URL se necessário
- [ ] Configurar domínio personalizado
- [ ] Configurar certificado SSL

### 📊 Monitoramento
- [ ] Configurar logs de produção
- [ ] Configurar backup automático do MongoDB
- [ ] Configurar alertas de sistema
- [ ] Configurar métricas de performance

### 🧪 Testes de Produção
- [ ] Executar todos os testes automatizados
- [ ] Testar em diferentes browsers
- [ ] Testar responsividade mobile
- [ ] Testar com dados reais
- [ ] Validar performance

---

## 🔧 Checklist de Manutenção Regular

### 📅 Diariamente
- [ ] Verificar logs de erro
- [ ] Verificar status dos serviços
- [ ] Monitorar uso de recursos

### 📅 Semanalmente  
- [ ] Backup do MongoDB
- [ ] Atualizar dependências de segurança
- [ ] Revisar logs de acesso
- [ ] Verificar espaço em disco

### 📅 Mensalmente
- [ ] Atualizar todas as dependências
- [ ] Revisar e limpar logs antigos
- [ ] Analisar métricas de uso
- [ ] Planejar novas funcionalidades

---

## 🆘 Checklist de Troubleshooting

### 🔴 Backend Não Responde
- [ ] Verificar se Python está rodando
- [ ] Verificar logs: `tail -f /var/log/supervisor/backend.*.log`
- [ ] Verificar conexão MongoDB
- [ ] Verificar porta 8001 livre
- [ ] Reiniciar: `sudo supervisorctl restart backend`

### 🔴 Frontend Não Carrega
- [ ] Verificar se Node.js está rodando
- [ ] Verificar logs: `tail -f /var/log/supervisor/frontend.*.log`
- [ ] Verificar porta 3000 livre
- [ ] Verificar REACT_APP_BACKEND_URL
- [ ] Reiniciar: `sudo supervisorctl restart frontend`

### 🔴 Erro de Conexão Frontend → Backend
- [ ] Verificar CORS no browser (F12)
- [ ] Testar health check: `curl http://localhost:8001/api/health`
- [ ] Verificar network requests (F12 → Network)
- [ ] Verificar variáveis de ambiente

### 🔴 Erro de Autenticação
- [ ] Testar login via curl
- [ ] Verificar se token está sendo enviado
- [ ] Verificar SECRET_KEY
- [ ] Verificar expiração do token

### 🔴 MongoDB Não Conecta
- [ ] Verificar se mongod está rodando: `ps aux | grep mongo`
- [ ] Testar conexão: `mongo --eval "db.runCommand('ping')"`
- [ ] Verificar MONGO_URL no .env
- [ ] Verificar permissões de acesso

---

## 📈 Checklist de Funcionalidades Futuras

### 🎯 Curto Prazo (1-2 semanas)
- [ ] Sistema de busca de equipamentos
- [ ] Filtros por fabricante/localização
- [ ] Paginação de resultados
- [ ] Histórico de manutenções

### 🎯 Médio Prazo (1-2 meses)
- [ ] Dashboard com gráficos
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Sistema de usuários multi-nível
- [ ] Notificações por email

### 🎯 Longo Prazo (3-6 meses)
- [ ] API mobile
- [ ] Integração com sistemas hospitalares
- [ ] Assinatura digital de documentos
- [ ] Análise preditiva de falhas

---

## 📝 Templates de Checklist para Novas Funcionalidades

### Adicionando Nova Funcionalidade

#### Backend
- [ ] Criar modelo Pydantic
- [ ] Implementar endpoint
- [ ] Adicionar validações
- [ ] Implementar testes
- [ ] Atualizar documentação

#### Frontend  
- [ ] Criar componente React
- [ ] Implementar integração com API
- [ ] Adicionar validações de formulário
- [ ] Implementar feedback visual
- [ ] Testar responsividade

#### Testes
- [ ] Testar endpoint via curl
- [ ] Testar interface manualmente
- [ ] Executar testes automatizados
- [ ] Validar em diferentes browsers
- [ ] Documentar casos de teste

#### Deploy
- [ ] Atualizar requirements.txt/package.json
- [ ] Executar script de deploy
- [ ] Verificar em produção
- [ ] Atualizar documentação
- [ ] Comunicar mudanças

---

*Use este checklist para garantir que todas as etapas sejam seguidas corretamente!*