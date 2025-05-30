#!/bin/bash

# 🧪 Script de Testes - API de Gestão de Equipamentos Médicos
# Autor: Sistema Automatizado
# Data: 30/05/2024
# Descrição: Script para testar todos os endpoints da API

echo "🧪 Iniciando testes da API de Gestão de Equipamentos Médicos..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
API_BASE="http://localhost:8001/api"
USERNAME="admin"
PASSWORD="admin"
TOKEN=""

# Função para imprimir mensagens coloridas
print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✅ PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[❌ FAIL]${NC} $1"
}

# Função para fazer requisições
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local data=$4
    local description=$5
    
    print_test "$description"
    
    if [ "$method" = "GET" ]; then
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $TOKEN" "$API_BASE$endpoint")
        else
            response=$(curl -s -w "%{http_code}" "$API_BASE$endpoint")
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$TOKEN" ]; then
            response=$(curl -s -w "%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$data" "$API_BASE$endpoint")
        else
            response=$(curl -s -w "%{http_code}" -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "$data" "$API_BASE$endpoint")
        fi
    fi
    
    status_code="${response: -3}"
    body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "Status: $status_code"
        if [ "$endpoint" = "/login" ] && [ "$status_code" = "200" ]; then
            TOKEN=$(echo "$body" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
            echo "Token obtido: ${TOKEN:0:20}..."
        fi
    else
        print_fail "Esperado: $expected_status, Obtido: $status_code"
        echo "Response: $body"
    fi
    
    echo ""
}

# Iniciar testes
echo "🔍 Testando endpoints da API..."
echo ""

# 1. Health Check
test_endpoint "GET" "/health" "200" "" "Health Check"

# 2. Login válido
test_endpoint "POST" "/login" "200" "username=$USERNAME&password=$PASSWORD" "Login com credenciais válidas"

# 3. Login inválido
test_endpoint "POST" "/login" "401" "username=admin&password=wrong" "Login com credenciais inválidas"

# 4. Get user info (requer token)
test_endpoint "GET" "/me" "200" "" "Obter informações do usuário"

# 5. Listar equipamentos
test_endpoint "GET" "/equipamentos" "200" "" "Listar equipamentos"

# 6. Criar equipamento
equipment_data='{
    "nome": "Monitor Cardíaco",
    "modelo": "MC-2024",
    "fabricante": "TechMed",
    "numero_serie": "TM2024001",
    "localizacao": "UTI - Leito 10",
    "status": "operacional"
}'
test_endpoint "POST" "/equipamentos" "201" "$equipment_data" "Criar equipamento"

# 7. Listar equipamentos novamente (deve ter +1)
test_endpoint "GET" "/equipamentos" "200" "" "Listar equipamentos (após criação)"

# 8. Criar manutenção
maintenance_data='{
    "equipamento_id": "test-equipment-id",
    "tipo": "preventiva",
    "descricao": "Manutenção de teste automatizada",
    "data_prevista": "2025-06-30T10:00:00.000Z",
    "status": "pendente"
}'
test_endpoint "POST" "/manutencoes" "201" "$maintenance_data" "Criar manutenção"

# 9. Listar manutenções
test_endpoint "GET" "/manutencoes" "200" "" "Listar manutenções"

# 10. Obter relatórios
test_endpoint "GET" "/relatorios" "200" "" "Obter relatórios"

# 11. Obter notificações
test_endpoint "GET" "/notificacoes" "200" "" "Obter notificações"

echo "🏁 Testes concluídos!"
echo ""

# Teste final: verificar se todos os serviços estão rodando
echo "🔍 Verificando status dos serviços..."

if pgrep -f "python.*server.py" > /dev/null; then
    print_success "Backend Python está rodando"
else
    print_fail "Backend Python não está rodando"
fi

if pgrep -f "node.*react-scripts" > /dev/null; then
    print_success "Frontend React está rodando"
else
    print_fail "Frontend React não está rodando"
fi

if pgrep -x "mongod" > /dev/null; then
    print_success "MongoDB está rodando"
else
    print_fail "MongoDB não está rodando"
fi

echo ""
echo "📋 Para ver logs detalhados:"
echo "Backend: tail -f /var/log/supervisor/backend.*.log"
echo "Frontend: tail -f /var/log/supervisor/frontend.*.log"
echo ""
echo "🌐 URLs para teste manual:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8001/api/health"
echo "Credenciais: $USERNAME/$PASSWORD"
