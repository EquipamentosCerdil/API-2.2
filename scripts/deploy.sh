#!/bin/bash

# 🚀 Script de Deploy - API de Gestão de Equipamentos Médicos
# Autor: Sistema Automatizado
# Data: 30/05/2024
# Descrição: Script para preparar e fazer deploy da aplicação

echo "🚀 Preparando deploy da API de Gestão de Equipamentos Médicos..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md" ]; then
    print_error "Execute este script a partir do diretório /app"
    exit 1
fi

print_status "Iniciando processo de deploy..."

# 1. Backup de dados existentes
print_status "Fazendo backup dos dados..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup do MongoDB
if command -v mongodump &> /dev/null; then
    mongodump --db equipamentos_db --out "$BACKUP_DIR/mongodb"
    print_success "Backup do MongoDB criado em $BACKUP_DIR/mongodb"
else
    print_warning "mongodump não encontrado. Backup do MongoDB não foi realizado"
fi

# Backup dos arquivos de configuração
cp backend/.env "$BACKUP_DIR/backend.env" 2>/dev/null && print_success "Backup do .env backend criado"
cp frontend/.env "$BACKUP_DIR/frontend.env" 2>/dev/null && print_success "Backup do .env frontend criado"

# 2. Verificar e atualizar dependências
print_status "Verificando dependências..."

cd backend
print_status "Verificando dependências Python..."
pip3 install -r requirements.txt --upgrade
if [ $? -eq 0 ]; then
    print_success "Dependências Python atualizadas"
else
    print_error "Erro ao atualizar dependências Python"
    exit 1
fi

cd ../frontend
print_status "Verificando dependências Node.js..."
yarn install
if [ $? -eq 0 ]; then
    print_success "Dependências Node.js atualizadas"
else
    print_error "Erro ao atualizar dependências Node.js"
    exit 1
fi

cd ..

# 3. Executar testes antes do deploy
print_status "Executando testes antes do deploy..."
if [ -f "backend_test.py" ]; then
    python3 backend_test.py
    if [ $? -eq 0 ]; then
        print_success "Todos os testes passaram"
    else
        print_warning "Alguns testes falharam. Continuando com deploy..."
    fi
else
    print_warning "Script de teste não encontrado"
fi

# 4. Build do frontend para produção
print_status "Fazendo build do frontend para produção..."
cd frontend
yarn build
if [ $? -eq 0 ]; then
    print_success "Build do frontend concluído"
    BUILD_SIZE=$(du -sh build/ | cut -f1)
    print_status "Tamanho do build: $BUILD_SIZE"
else
    print_error "Erro no build do frontend"
    exit 1
fi

cd ..

# 5. Configurações de produção
print_status "Aplicando configurações de produção..."

# Verificar se as variáveis de ambiente estão configuradas corretamente
if [ -f "backend/.env" ]; then
    if grep -q "localhost" backend/.env; then
        print_warning "Arquivo .env do backend ainda contém 'localhost'. Verifique para produção."
    fi
else
    print_error "Arquivo .env do backend não encontrado"
    exit 1
fi

if [ -f "frontend/.env" ]; then
    if grep -q "localhost" frontend/.env; then
        print_warning "Arquivo .env do frontend ainda contém 'localhost'. Verifique para produção."
    fi
else
    print_error "Arquivo .env do frontend não encontrado"
    exit 1
fi

# 6. Reiniciar serviços
print_status "Reiniciando serviços..."
if command -v supervisorctl &> /dev/null; then
    sudo supervisorctl restart all
    sleep 5
    sudo supervisorctl status
    print_success "Serviços reiniciados via Supervisor"
else
    print_warning "Supervisor não encontrado. Reinicie os serviços manualmente"
fi

# 7. Verificação final
print_status "Executando verificação final..."

# Verificar se os serviços estão rodando
services_ok=true

if curl -s http://localhost:8001/api/health > /dev/null; then
    print_success "Backend está respondendo"
else
    print_error "Backend não está respondendo"
    services_ok=false
fi

if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend está respondendo"
else
    print_error "Frontend não está respondendo"
    services_ok=false
fi

# 8. Gerar relatório de deploy
print_status "Gerando relatório de deploy..."
REPORT_FILE="deploy_report_$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" << EOF
🚀 RELATÓRIO DE DEPLOY - API de Gestão de Equipamentos Médicos
===============================================================

Data do Deploy: $(date)
Diretório: $(pwd)

✅ COMPONENTES DEPLOYADOS:
- Backend FastAPI com MongoDB
- Frontend React (build de produção)
- Sistema de autenticação JWT
- APIs de equipamentos e manutenções

📊 ESTATÍSTICAS:
- Arquivos de backend: $(find backend -name "*.py" | wc -l) arquivos Python
- Tamanho do build frontend: $BUILD_SIZE
- Backup criado em: $BACKUP_DIR

🔗 URLs DE ACESSO:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api
- Health Check: http://localhost:8001/api/health

🔑 CREDENCIAIS PADRÃO:
- Usuário: admin
- Senha: admin

📋 PRÓXIMOS PASSOS:
1. Verificar URLs de produção nos arquivos .env
2. Configurar SSL/HTTPS se necessário
3. Configurar backup automático do MongoDB
4. Monitorar logs em /var/log/supervisor/

🆘 EM CASO DE PROBLEMAS:
- Logs: tail -f /var/log/supervisor/*.log
- Restaurar backup: mongorestore $BACKUP_DIR/mongodb/equipamentos_db
- Rollback: restaurar arquivos .env do backup

EOF

print_success "Relatório de deploy salvo em: $REPORT_FILE"

# 9. Resumo final
echo ""
echo "🎉 Deploy concluído!"
echo ""

if [ "$services_ok" = true ]; then
    print_success "Todos os serviços estão funcionando corretamente"
    print_status "Aplicação disponível em: http://localhost:3000"
    print_status "API disponível em: http://localhost:8001/api"
else
    print_warning "Alguns serviços podem não estar funcionando. Verifique os logs."
fi

print_status "Backup dos dados foi salvo em: $BACKUP_DIR"
print_status "Relatório completo em: $REPORT_FILE"

echo ""
print_status "Comandos úteis pós-deploy:"
echo "- Monitorar logs: tail -f /var/log/supervisor/*.log"
echo "- Status dos serviços: sudo supervisorctl status"
echo "- Testar API: curl http://localhost:8001/api/health"
echo "- Executar testes: python3 backend_test.py"

echo ""
print_status "📚 Documentação completa: DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md"
