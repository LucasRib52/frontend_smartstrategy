import React, { useEffect, useState } from 'react';
import './SelecionarEmpresaPF.css';
import api from '../../services/api';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const SelecionarEmpresaPF = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await api.get('/selecionarperfilpf/empresas/');
        setEmpresas(response.data);
      } catch (err) {
        setError('Erro ao carregar empresas.');
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresas();
  }, []);

  const handleSelecionar = async (empresa) => {
    try {
      // Atualiza a empresa no backend e recebe o novo token
      const response = await api.post('/selecionarperfilpf/set-empresa/', { empresa_id: empresa.id });
      
      // Atualiza o usuário no localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.user) {
        userData.user.empresa_atual = empresa;
        // Salva o novo token retornado pelo backend
        if (response.data && response.data.access) {
          userData.access = response.data.access;
        }
        if (response.data && response.data.refresh) {
          userData.refresh = response.data.refresh;
        }
        localStorage.setItem('user', JSON.stringify(userData));
      }
      // Também mantém a empresa selecionada separadamente para compatibilidade
      localStorage.setItem('empresaSelecionada', JSON.stringify(empresa));
      
      // NÃO chama mais refreshToken aqui!
      
      navigate('/home');
    } catch (err) {
      console.error('Erro ao selecionar empresa:', err);
      setError('Erro ao selecionar empresa.');
    }
  };

  const handleEntrarPerfil = () => {
    // Remove a empresa selecionada
    localStorage.removeItem('empresaSelecionada');
    
    // Atualiza o usuário no localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.user) {
      userData.user.empresa_atual = null;
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    navigate('/home');
  };

  if (loading) return <div className="selecionar-empresa-pf-loading">Carregando empresas...</div>;
  if (error) return <div className="selecionar-empresa-pf-erro">{error}</div>;

  return (
    <div className="selecionar-empresa-pf-container">
      <h2 className="selecionar-empresa-pf-titulo">Selecione a empresa para acessar</h2>
      
      <div className="selecionar-empresa-pf-perfil-option">
        <button
          className="selecionar-empresa-pf-botao-perfil"
          onClick={handleEntrarPerfil}
        >
          Entrar no Meu Perfil
        </button>
      </div>

      <div className="selecionar-empresa-pf-lista">
        {empresas.map((empresa) => (
          <div key={empresa.id} className="selecionar-empresa-pf-card">
            <div className="selecionar-empresa-pf-logo-area">
              {empresa.logomarca_url ? (
                <img className="selecionar-empresa-pf-logo" src={empresa.logomarca_url} alt={`Logo ${empresa.nome_fantasia}`} />
              ) : (
                <div className="selecionar-empresa-pf-logo-placeholder">
                  {empresa.nome_fantasia?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div className="selecionar-empresa-pf-nome">{empresa.nome_fantasia}</div>
            <div className="selecionar-empresa-pf-cnpj">CNPJ: {empresa.cnpj}</div>
            <div className="selecionar-empresa-pf-email">Email: {empresa.email_comercial}</div>
            <button
              className="selecionar-empresa-pf-botao"
              onClick={() => handleSelecionar(empresa)}
            >
              Selecionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelecionarEmpresaPF; 