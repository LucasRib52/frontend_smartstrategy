import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { vendaService } from '../../../../services/vendaService';
import '../../../Marketing/google/Detail/Detail.css';

const DetailInstagram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função auxiliar para formatar valores monetários
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  // Função auxiliar para formatar números com casas decimais
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return '-';
    const number = parseFloat(value);
    return isNaN(number) ? '-' : number.toFixed(decimals);
  };

  // Função auxiliar para formatar porcentagem
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '-';
    const number = parseFloat(value);
    return isNaN(number) ? '-' : `${number.toFixed(2)}%`;
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vendaService.getById(id);
      setData(response);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os dados');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await vendaService.delete(id);
        navigate('/marketing/instagram');
      } catch (err) {
        console.error('Erro ao excluir:', err);
      }
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">Dados não encontrados</div>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/marketing/instagram')}>
          <FiArrowLeft /> Voltar
        </button>
        <div className="header-actions">
          <button className="btn-edit" onClick={() => navigate(`/marketing/instagram/editar/${id}`)}>
            <FiEdit2 /> Editar
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            <FiTrash2 /> Excluir
          </button>
        </div>
      </div>

      <div className="detail-content">
        <h1>Detalhes do Registro</h1>
        
        <div className="detail-grid">
          <div className="detail-section">
            <h2>Informações Básicas</h2>
            <div className="detail-row">
              <span className="label">Data:</span>
              <span className="value">{data.data ? new Date(data.data).toLocaleDateString('pt-BR') : '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Mês:</span>
              <span className="value">{data.mes || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ano:</span>
              <span className="value">{data.ano || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Semana:</span>
              <span className="value">{data.semana || '-'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Investimentos</h2>
            <div className="detail-row">
              <span className="label">Investimento Realizado:</span>
              <span className="value">{formatCurrency(data.invest_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Investimento Projetado:</span>
              <span className="value">{formatCurrency(data.invest_projetado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Saldo do Investimento:</span>
              <span className="value">{formatCurrency(data.saldo_invest)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Faturamento</h2>
            <div className="detail-row">
              <span className="label">Vendas Instagram:</span>
              <span className="value">{formatCurrency(data.vendas_instagram)}</span>
            </div>
            <div className="detail-row">
              <span className="label">FAT Projetado:</span>
              <span className="value">{formatCurrency(data.fat_proj)}</span>
            </div>
            <div className="detail-row">
              <span className="label">FAT Campanha:</span>
              <span className="value">{formatCurrency(data.fat_camp_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">FAT Geral:</span>
              <span className="value">{formatCurrency(data.fat_geral)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Saldo FAT:</span>
              <span className="value">{formatCurrency(data.saldo_fat)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Métricas</h2>
            <div className="detail-row">
              <span className="label">ROI:</span>
              <span className="value">{formatPercentage(data.roi_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">ROAS:</span>
              <span className="value">{formatNumber(data.roas_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">CAC:</span>
              <span className="value">{formatCurrency(data.cac_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Ticket Médio:</span>
              <span className="value">{formatCurrency(data.ticket_medio_realizado)}</span>
            </div>
            <div className="detail-row">
              <span className="label">ARPU:</span>
              <span className="value">{formatCurrency(data.arpu_realizado)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Clientes e Conversões</h2>
            <div className="detail-row">
              <span className="label">Leads:</span>
              <span className="value">{data.leads || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Clientes Novos:</span>
              <span className="value">{data.clientes_novos || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Clientes Recorrentes:</span>
              <span className="value">{data.clientes_recorrentes || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Conversões:</span>
              <span className="value">{data.conversoes || '-'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Taxa de Conversão:</span>
              <span className="value">{formatPercentage(data.taxa_conversao)}</span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Clima</h2>
            <div className="detail-row">
              <span className="label">Condição:</span>
              <span className="value">{data.clima || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailInstagram; 