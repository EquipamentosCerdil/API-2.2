#!/bin/bash

# 🏥 Script de Setup - API de Gestão de Equipamentos Médicos
# Autor: Sistema Automatizado
# Data: 30/05/2024
# Descrição: Script para configurar o ambiente completo

echo "🏥 Iniciando setup da API de Gestão de Equipamentos Médicos..."

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

print_status "Verificando dependências do sistema..."

# Verificar se MongoDB está rodando
if pgrep -x "mongod" > /dev/null; then
    print_success "MongoDB está rodando"
else
    print_warning "MongoDB não está rodando. Tentando iniciar..."
    # Comando para iniciar MongoDB varia por sistema
    sudo service mongodb start 2>/dev/null || print_warning "Não foi possível iniciar MongoDB automaticamente"
fi

# Verificar se Python está instalado
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    print_success "Python encontrado: $PYTHON_VERSION"
else
    print_error "Python3 não encontrado. Instale Python 3.11+"
    exit 1
fi

# Verificar se Node.js está instalado
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js não encontrado. Instale Node.js 18+"
    exit 1
fi

# Verificar se yarn está instalado
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    print_success "Yarn encontrado: $YARN_VERSION"
else
    print_warning "Yarn não encontrado. Instalando..."
    npm install -g yarn
fi

print_status "Configurando Backend..."

# Instalar dependências do backend
cd backend
if [ -f "requirements.txt" ]; then
    print_status "Instalando dependências Python..."
    pip3 install -r requirements.txt
    print_success "Dependências Python instaladas"
else
    print_error "Arquivo requirements.txt não encontrado"
    exit 1
fi

# Verificar arquivo .env do backend
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado no backend. Criando..."
    cat > .env << EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="equipamentos_db"
SECRET_KEY="sua_chave_secreta_para_jwt_equipamentos_medicos_2024"
EOF
    print_success "Arquivo .env criado no backend"
fi

cd ..

print_status "Configurando Frontend..."

# Instalar dependências do frontend
cd frontend
if [ -f "package.json" ]; then
    print_status "Instalando dependências Node.js..."
    yarn install
    print_success "Dependências Node.js instaladas"
else
    print_error "Arquivo package.json não encontrado"
    exit 1
fi

# Verificar arquivo .env do frontend
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado no frontend. Criando..."
    cat > .env << EOF
WDS_SOCKET_PORT=443
REACT_APP_BACKEND_URL=http://localhost:8001
EOF
    print_success "Arquivo .env criado no frontend"
fi

cd ..

print_status "Verificando Supervisor..."

# Verificar se supervisor está instalado
if command -v supervisorctl &> /dev/null; then
    print_success "Supervisor encontrado"
    
    # Reiniciar todos os serviços
    print_status "Reiniciando serviços..."
    sudo supervisorctl restart all
    
    # Verificar status
    print_status "Status dos serviços:"
    sudo supervisorctl status
    
else
    print_warning "Supervisor não encontrado. Os serviços devem ser iniciados manualmente"
    print_status "Para iniciar manualmente:"
    echo "Backend: cd backend && python server.py"
    echo "Frontend: cd frontend && yarn start"
fi

print_status "Testando API..."

# Aguardar alguns segundos para os serviços iniciarem
sleep 5

# Testar health check
if curl -s http://localhost:8001/api/health > /dev/null; then
    print_success "Backend está respondendo na porta 8001"
else
    print_warning "Backend não está respondendo. Verifique os logs"
fi

# Testar frontend
if curl -s http://localhost:3000 > /dev/null; then
    print_success "Frontend está respondendo na porta 3000"
else
    print_warning "Frontend não está respondendo. Verifique os logs"
fi

print_success "Setup concluído!"
print_status "Acesse a aplicação em: http://localhost:3000"
print_status "Credenciais: admin/admin"
print_status "Documentação: DOCUMENTACAO_API_EQUIPAMENTOS_MEDICOS.md"

echo ""
print_status "Comandos úteis:"
echo "- Verificar logs: tail -f /var/log/supervisor/*.log"
echo "- Reiniciar serviços: sudo supervisorctl restart all"
echo "- Testar API: curl http://localhost:8001/api/health"
echo "- Executar testes: python backend_test.py"
