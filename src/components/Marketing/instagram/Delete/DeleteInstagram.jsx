import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';
import { vendaService } from '../../../../services/vendaService';
import '../../../Marketing/google/Delete/Delete.css';

const DeleteInstagram = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
    try {
      setDeleting(true);
      await vendaService.delete(id);
      navigate('/marketing/instagram');
    } catch (err) {
      setError('Erro ao excluir o registro');
      console.error('Erro ao excluir:', err);
      setDeleting(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div className="error">Dados não encontrados</div>;

  return (
    <div className="delete-container">
      <div className="delete-header">
        <button className="btn-back" onClick={() => navigate('/marketing/google')}>
          <FiArrowLeft /> Voltar
        </button>
        <h1>Excluir Registro</h1>
      </div>

      <div className="delete-content">
        <div className="delete-warning">
          <h2>
            <FiAlertTriangle /> Atenção!
          </h2>
          <p>
            Você está prestes a excluir o registro do dia {new Date(data.data).toLocaleDateString('pt-BR')}. 
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="delete-details">
          <h2>Detalhes do Registro</h2>
          
          <div className="detail-grid">
            <div className="detail-section">
              <h3>Informações Básicas</h3>
              <div className="detail-row">
                <span className="label">Data:</span>
                <span className="value">{new Date(data.data).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="detail-row">
                <span className="label">Mês:</span>
                <span className="value">{data.mes}</span>
              </div>
              <div className="detail-row">
                <span className="label">Ano:</span>
                <span className="value">{data.ano}</span>
              </div>
              <div className="detail-row">
                <span className="label">Semana:</span>
                <span className="value">{data.semana}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Investimentos</h3>
              <div className="detail-row">
                <span className="label">Investimento Realizado:</span>
                <span className="value currency">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.invest_realizado)}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Investimento Projetado:</span>
                <span className="value currency">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.invest_projetado)}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Faturamento</h3>
              <div className="detail-row">
                <span className="label">Vendas Instagram:</span>
                <span className="value currency">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.vendas_instagram)}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">FAT Geral:</span>
                <span className="value currency">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.fat_geral)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="delete-actions">
          <button 
            className="btn-cancel" 
            onClick={() => navigate('/marketing/instagram')}
          >
            Cancelar
          </button>
          <button 
            className="btn-delete" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInstagram; 