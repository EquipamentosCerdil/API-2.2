import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Componente de Login
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API}/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      onLogin(access_token);
    } catch (error) {
      setError('Credenciais inválidas');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Equipamentos</h1>
          <p className="text-gray-600">Gestão de Equipamentos Médicos</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Credenciais padrão:</p>
            <p><strong>Usuário:</strong> admin</p>
            <p><strong>Senha:</strong> admin</p>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para adicionar equipamento
const EquipmentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    modelo: '',
    fabricante: '',
    numero_serie: '',
    localizacao: '',
    status: 'operacional'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      nome: '',
      modelo: '',
      fabricante: '',
      numero_serie: '',
      localizacao: '',
      status: 'operacional'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-bold mb-4">Adicionar Equipamento</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
            <input
              type="text"
              value={formData.modelo}
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fabricante</label>
            <input
              type="text"
              value={formData.fabricante}
              onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Número de Série</label>
            <input
              type="text"
              value={formData.numero_serie}
              onChange={(e) => setFormData({...formData, numero_serie: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
            <input
              type="text"
              value={formData.localizacao}
              onChange={(e) => setFormData({...formData, localizacao: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para adicionar manutenção
const MaintenanceModal = ({ isOpen, onClose, onSave, equipamentos }) => {
  const [formData, setFormData] = useState({
    equipamento_id: '',
    tipo: 'preventiva',
    descricao: '',
    data_prevista: '',
    status: 'pendente'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      equipamento_id: '',
      tipo: 'preventiva',
      descricao: '',
      data_prevista: '',
      status: 'pendente'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-bold mb-4">Agendar Manutenção</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipamento</label>
            <select
              value={formData.equipamento_id}
              onChange={(e) => setFormData({...formData, equipamento_id: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um equipamento</option>
              {equipamentos.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nome} - {eq.modelo}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Prevista</label>
            <input
              type="date"
              value={formData.data_prevista}
              onChange={(e) => setFormData({...formData, data_prevista: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dashboard Principal
const Dashboard = ({ token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('equipamentos');
  const [equipamentos, setEquipamentos] = useState([]);
  const [manutencoes, setManutencoes] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Configuração do axios com token
  const apiClient = axios.create({
    baseURL: API,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    loadUserInfo();
    loadData();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await apiClient.get('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao carregar informações do usuário:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [equipResp, manutResp, relResp, notifResp] = await Promise.all([
        apiClient.get('/equipamentos'),
        apiClient.get('/manutencoes'),
        apiClient.get('/relatorios'),
        apiClient.get('/notificacoes')
      ]);

      setEquipamentos(equipResp.data.equipamentos || []);
      setManutencoes(manutResp.data.manutencoes || []);
      setRelatorio(relResp.data.relatorio);
      setNotificacoes(notifResp.data.notificacoes || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleSaveEquipment = async (equipmentData) => {
    try {
      await apiClient.post('/equipamentos', equipmentData);
      setShowEquipmentModal(false);
      loadData(); // Recarregar dados
      showMessage('Equipamento adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
      showMessage('Erro ao adicionar equipamento', 'error');
    }
  };

  const handleSaveMaintenance = async (maintenanceData) => {
    try {
      // Converter data para ISO string
      const data = {
        ...maintenanceData,
        data_prevista: new Date(maintenanceData.data_prevista).toISOString()
      };
      
      await apiClient.post('/manutencoes', data);
      setShowMaintenanceModal(false);
      loadData(); // Recarregar dados
      showMessage('Manutenção agendada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao agendar manutenção:', error);
      showMessage('Erro ao agendar manutenção', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Equipamentos Médicos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Bem-vindo, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['equipamentos', 'manutencoes', 'relatorios', 'notificacoes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        )}

        {/* Tab de Equipamentos */}
        {activeTab === 'equipamentos' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Equipamentos</h2>
              <button
                onClick={() => setShowEquipmentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Adicionar Equipamento
              </button>
            </div>
            {message.text && (
              <div className={`px-6 py-2 ${
                message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' :
                message.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
                'bg-blue-100 border-blue-500 text-blue-700'
              } border-l-4`}>
                {message.text}
              </div>
            )}
            <div className="px-6 py-4">
              {equipamentos.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhum equipamento cadastrado</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipamentos.map((equipamento) => (
                    <div key={equipamento.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{equipamento.nome}</h3>
                      <p className="text-sm text-gray-600">Modelo: {equipamento.modelo}</p>
                      <p className="text-sm text-gray-600">Fabricante: {equipamento.fabricante}</p>
                      <p className="text-sm text-gray-600">Local: {equipamento.localizacao}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                        equipamento.status === 'operacional' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {equipamento.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab de Manutenções */}
        {activeTab === 'manutencoes' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Manutenções</h2>
              <button
                onClick={() => {
                  if (equipamentos.length === 0) {
                    showMessage('Adicione pelo menos um equipamento antes de agendar uma manutenção!', 'error');
                    return;
                  }
                  setShowMaintenanceModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Agendar Manutenção
              </button>
            </div>
            {message.text && (
              <div className={`px-6 py-2 ${
                message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' :
                message.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' :
                'bg-blue-100 border-blue-500 text-blue-700'
              } border-l-4`}>
                {message.text}
              </div>
            )}
            <div className="px-6 py-4">
              {manutencoes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma manutenção agendada</p>
              ) : (
                <div className="space-y-4">
                  {manutencoes.map((manutencao) => (
                    <div key={manutencao.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{manutencao.tipo || 'Manutenção'}</h3>
                          <p className="text-sm text-gray-600">{manutencao.descricao}</p>
                          <p className="text-sm text-gray-600">Equipamento: {manutencao.equipamento_id}</p>
                          {manutencao.data_prevista && (
                            <p className="text-sm text-gray-600">
                              Data: {new Date(manutencao.data_prevista).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          manutencao.status === 'concluida' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {manutencao.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab de Relatórios */}
        {activeTab === 'relatorios' && relatorio && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Relatórios</h2>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900">Equipamentos</h3>
                  <p className="text-3xl font-bold text-blue-600">{relatorio.equipamentos.total}</p>
                  <p className="text-sm text-blue-700">Total cadastrados</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900">Manutenções</h3>
                  <p className="text-3xl font-bold text-green-600">{relatorio.manutencoes.total}</p>
                  <p className="text-sm text-green-700">Total agendadas</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900">Pendentes</h3>
                  <p className="text-3xl font-bold text-yellow-600">{relatorio.manutencoes.pendentes}</p>
                  <p className="text-sm text-yellow-700">Manutenções pendentes</p>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Relatório gerado em: {new Date(relatorio.gerado_em).toLocaleString('pt-BR')}</p>
                <p>Gerado por: {relatorio.gerado_por}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab de Notificações */}
        {activeTab === 'notificacoes' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notificações</h2>
            </div>
            <div className="px-6 py-4">
              {notificacoes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma notificação no momento</p>
              ) : (
                <div className="space-y-4">
                  {notificacoes.map((notificacao) => (
                    <div key={notificacao.id} className={`border-l-4 p-4 ${
                      notificacao.prioridade === 'alta' 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-yellow-500 bg-yellow-50'
                    }`}>
                      <div className="flex">
                        <div className="flex-1">
                          <h3 className="font-semibold">{notificacao.titulo}</h3>
                          <p className="text-sm text-gray-700">{notificacao.mensagem}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          notificacao.prioridade === 'alta' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {notificacao.prioridade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modais */}
      <EquipmentModal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        onSave={handleSaveEquipment}
      />
      <MaintenanceModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        onSave={handleSaveMaintenance}
        equipamentos={equipamentos}
      />
    </div>
  );
};

// Componente Principal
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (token) {
      // Verificar se o token é válido
      checkTokenValidity();
    }
  }, [token]);

  const checkTokenValidity = async () => {
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axios.get(`${API}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Token inválido:', error);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Dashboard token={token} onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
