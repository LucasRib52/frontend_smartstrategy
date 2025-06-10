import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Empresas_PessoaFisica.css';
import api from '../../../services/api';

const Empresas_PessoaFisica = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await api.get('/empresa_pessoafisica/empresas/');
        setEmpresas(response.data);
      } catch (err) {
        setError('Erro ao carregar empresas vinculadas.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleSelecionarEmpresa = async (empresa) => {
    try {
      await api.post('/selecionarperfilpf/set-empresa/', { empresa_id: empresa.id });
      localStorage.setItem('empresaSelecionada', JSON.stringify(empresa));
      navigate('/marketing/google/preencher-semana');
    } catch (err) {
      setError('Erro ao selecionar empresa.');
    }
  };

  if (loading) {
    return (
      <div className="empresas-pf-loading">
        <div className="empresas-pf-spinner"></div>
        <p>Carregando suas empresas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empresas-pf-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="empresas-pf-empty">
        <i className="fas fa-building"></i>
        <h3>Nenhuma empresa vinculada</h3>
        <p>Você ainda não possui empresas vinculadas ao seu perfil.</p>
      </div>
    );
  }

  // Separar empresas por status
  const empresasAtivas = empresas.filter(empresa => empresa.status === 'accepted');
  const empresasInativas = empresas.filter(empresa => empresa.status === 'inactive');
  const empresasPendentes = empresas.filter(empresa => empresa.status === 'pending');
  const empresasRecusadas = empresas.filter(empresa => empresa.status === 'rejected');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return null;
      case 'inactive':
        return (
          <div className="empresas-pf-status-badge empresas-pf-status-inactive">
            <i className="fas fa-ban"></i> Sem Acesso
          </div>
        );
      case 'pending':
        return (
          <div className="empresas-pf-status-badge empresas-pf-status-pending">
            <i className="fas fa-clock"></i> Pendente
          </div>
        );
      case 'rejected':
        return (
          <div className="empresas-pf-status-badge empresas-pf-status-rejected">
            <i className="fas fa-times-circle"></i> Recusado
          </div>
        );
      default:
        return null;
    }
  };

  const renderEmpresaCard = (empresa, isActive = true) => (
    <div 
      key={empresa.id} 
      className={`empresas-pf-card ${!isActive ? 'empresas-pf-card-inactive' : ''}`}
    >
      <div className="empresas-pf-logo-area">
        {empresa.logomarca?.imagem ? (
          <img 
            className="empresas-pf-logo" 
            src={empresa.logomarca.imagem} 
            alt={`Logo ${empresa.nome_fantasia}`} 
          />
        ) : (
          <div className="empresas-pf-logo-placeholder">
            {empresa.nome_fantasia?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        {getStatusBadge(empresa.status)}
      </div>
      
      <div className="empresas-pf-info">
        <h3 className="empresas-pf-nome">{empresa.nome_fantasia}</h3>
        
        <div className="empresas-pf-cargo">
          <i className="fas fa-user-tie"></i> Cargo: {empresa.cargo || 'Não definido'}
        </div>

        <div className="empresas-pf-details">
          <div className="empresas-pf-detail-item">
            <span className="empresas-pf-detail-label">CNPJ:</span>
            <span className="empresas-pf-detail-value">{empresa.cnpj}</span>
          </div>
          
          <div className="empresas-pf-detail-item">
            <span className="empresas-pf-detail-label">Telefone:</span>
            <span className="empresas-pf-detail-value">{empresa.telefone1}</span>
          </div>
        </div>
        
        {isActive && (
          <button
            className="empresas-pf-botao-selecionar"
            onClick={() => handleSelecionarEmpresa(empresa)}
          >
            <i className="fas fa-check-circle"></i> Selecionar Empresa
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="empresas-pf-container">
      <h2 className="empresas-pf-title">Minhas Empresas</h2>
      <p className="empresas-pf-subtitle">Gerencie suas empresas vinculadas e acesse seus dados</p>
      
      <div className="empresas-pf-columns">
        {/* Coluna de Empresas Ativas */}
        <div className="empresas-pf-column">
          <h3 className="empresas-pf-column-title">
            <i className="fas fa-check-circle"></i> Empresas Ativas
          </h3>
          <div className="empresas-pf-grid">
            {empresasAtivas.map(empresa => renderEmpresaCard(empresa, true))}
            {empresasAtivas.length === 0 && (
              <div className="empresas-pf-empty-column">
                <i className="fas fa-building"></i>
                <p>Nenhuma empresa ativa</p>
              </div>
            )}
          </div>
        </div>

        {/* Coluna de Empresas Inativas */}
        <div className="empresas-pf-column">
          <h3 className="empresas-pf-column-title">
            <i className="fas fa-ban"></i> Empresas Inativas
          </h3>
          <div className="empresas-pf-grid">
            {empresasInativas.map(empresa => renderEmpresaCard(empresa, false))}
            {empresasInativas.length === 0 && (
              <div className="empresas-pf-empty-column">
                <i className="fas fa-building"></i>
                <p>Nenhuma empresa inativa</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Empresas Pendentes */}
      {empresasPendentes.length > 0 && (
        <div className="empresas-pf-section">
          <h3 className="empresas-pf-subtitle" style={{ marginTop: '2rem', marginBottom: '1.25rem', color: '#ffc107', fontWeight: '600' }}>
            <i className="fas fa-clock"></i> Convites Pendentes
          </h3>
          <div className="empresas-pf-grid">
            {empresasPendentes.map(empresa => renderEmpresaCard(empresa, false))}
          </div>
        </div>
      )}

      {/* Seção de Empresas Recusadas */}
      {empresasRecusadas.length > 0 && (
        <div className="empresas-pf-section">
          <h3 className="empresas-pf-subtitle" style={{ marginTop: '2rem', marginBottom: '1.25rem', color: '#6c757d', fontWeight: '600' }}>
            <i className="fas fa-times-circle"></i> Convites Recusados
          </h3>
          <div className="empresas-pf-grid">
            {empresasRecusadas.map(empresa => renderEmpresaCard(empresa, false))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Empresas_PessoaFisica; 