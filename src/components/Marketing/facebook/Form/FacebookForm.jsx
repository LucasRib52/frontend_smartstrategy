import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiSave, 
  FiDollarSign, 
  FiUsers, 
  FiTrendingUp, 
  FiCalendar,
  FiTarget,
  FiBarChart2,
  FiShoppingCart,
  FiPercent
} from 'react-icons/fi';
import { vendaService } from '../../../../services/vendaService';
import '../../../Marketing/google/Form/GoogleForm.css';

const FacebookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    invest_realizado: '',
    invest_projetado: '',
    vendas_facebook: '',
    fat_proj: '',
    fat_camp_realizado: '',
    fat_geral: '',
    ticket_medio_realizado: '',
    leads: '',
    clientes_novos: '',
    clientes_recorrentes: '',
    conversoes: '',
    // Campos calculados automaticamente
    mes: '',
    ano: '',
    semana: '',
    saldo_invest: 0,
    saldo_fat: 0,
    roi_realizado: 0,
    roas_realizado: 0,
    cac_realizado: 0,
    arpu_realizado: 0,
    taxa_conversao: 0,
    clima: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vendaService.getById(id);
      setFormData({
        ...response,
        vendas_facebook: response.vendas_facebook || '',
        mes: response.data ? new Date(response.data).toLocaleString('pt-BR', { month: 'long' }) : '',
        ano: response.data ? new Date(response.data).getFullYear() : '',
        semana: response.data ? Math.ceil(new Date(response.data).getDate() / 7) : '',
        saldo_invest: response.invest_projetado ? response.invest_projetado - response.invest_realizado : 0,
        saldo_fat: response.fat_proj ? response.fat_proj - response.fat_camp_realizado : 0,
        roi_realizado: response.invest_realizado > 0 ? ((response.fat_camp_realizado - response.invest_realizado) / response.invest_realizado * 100).toFixed(2) : '0',
        roas_realizado: response.invest_realizado > 0 ? (response.fat_camp_realizado / response.invest_realizado).toFixed(2) : '0',
        cac_realizado: response.invest_realizado > 0 ? (response.invest_realizado / (response.clientes_novos + response.clientes_recorrentes)).toFixed(2) : '0',
        arpu_realizado: response.invest_realizado > 0 ? (response.fat_camp_realizado / (response.clientes_novos + response.clientes_recorrentes)).toFixed(2) : '0',
        taxa_conversao: response.leads > 0 ? ((response.clientes_novos + response.clientes_recorrentes) / response.leads * 100).toFixed(2) : '0',
        clima: response.roi_realizado >= 100 ? '🌞 Excelente' : response.roi_realizado >= 50 ? '⛅ Bom' : response.roi_realizado >= 0 ? '🌥️ Regular' : '🌧️ Ruim'
      });
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os dados');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };

      // Validações específicas
      if (name === 'invest_realizado' || name === 'fat_camp_realizado') {
        const invest = parseFloat(newData.invest_realizado) || 0;
        const fatCamp = parseFloat(newData.fat_camp_realizado) || 0;
        
        if (fatCamp <= invest) {
          setError('O faturamento da campanha deve ser maior que o investimento realizado');
        } else {
          setError(null);
        }
      }

      // Cálculos automáticos
      if (name === 'data' && value) {
        const date = new Date(value);
        newData.mes = date.toLocaleString('pt-BR', { month: 'long' });
        newData.ano = date.getFullYear();
        newData.semana = Math.ceil(date.getDate() / 7);
      }

      // Cálculos financeiros
      const invest_realizado = parseFloat(newData.invest_realizado) || 0;
      const invest_projetado = parseFloat(newData.invest_projetado) || 0;
      const fat_camp_realizado = parseFloat(newData.fat_camp_realizado) || 0;
      const fat_proj = parseFloat(newData.fat_proj) || 0;
      const clientes_novos = parseInt(newData.clientes_novos) || 0;
      const clientes_recorrentes = parseInt(newData.clientes_recorrentes) || 0;
      const leads = parseInt(newData.leads) || 0;

      // Cálculo dos saldos
      newData.saldo_invest = invest_projetado - invest_realizado;
      newData.saldo_fat = fat_proj - fat_camp_realizado;

      // Cálculos de performance
      if (invest_realizado > 0) {
        newData.roi_realizado = ((fat_camp_realizado - invest_realizado) / invest_realizado * 100).toFixed(2);
        newData.roas_realizado = (fat_camp_realizado / invest_realizado).toFixed(2);
      } else {
        newData.roi_realizado = '0';
        newData.roas_realizado = '0';
      }

      // CAC (Customer Acquisition Cost)
      const total_clientes = clientes_novos + clientes_recorrentes;
      newData.cac_realizado = total_clientes > 0 ? (invest_realizado / total_clientes).toFixed(2) : '0';

      // ARPU (Average Revenue Per User)
      newData.arpu_realizado = total_clientes > 0 ? (fat_camp_realizado / total_clientes).toFixed(2) : '0';

      // Taxa de conversão
      newData.taxa_conversao = leads > 0 ? ((total_clientes / leads) * 100).toFixed(2) : '0';

      // Clima baseado no ROI
      const roi = parseFloat(newData.roi_realizado);
      if (roi >= 100) {
        newData.clima = '🌞 Excelente';
      } else if (roi >= 50) {
        newData.clima = '⛅ Bom';
      } else if (roi >= 0) {
        newData.clima = '🌥️ Regular';
      } else {
        newData.clima = '🌧️ Ruim';
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('FacebookForm: Iniciando submit do formulário');
    
    setLoading(true);
    setError(null);

    try {
      console.log('FacebookForm: Preparando dados para envio');
      // Removendo campos calculados do payload
      const { 
        mes, ano, semana, saldo_invest, saldo_fat, 
        roi_realizado, roas_realizado, cac_realizado, 
        arpu_realizado, taxa_conversao, clima,
        ...dataToSubmit 
      } = formData;

      console.log('FacebookForm: Dados a serem enviados:', dataToSubmit);

      if (id) {
        console.log('FacebookForm: Atualizando venda existente:', id);
        await vendaService.update(id, dataToSubmit);
      } else {
        console.log('FacebookForm: Criando nova venda');
        await vendaService.create(dataToSubmit);
      }
      console.log('FacebookForm: Operação concluída com sucesso');
      navigate('/marketing/facebook');
    } catch (err) {
      console.error('FacebookForm: Erro detalhado ao salvar:', err);
      setError('Erro ao salvar os dados: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para formatar moeda
  const formatCurrency = (value) => {
    const num = Number(value);
    return isNaN(num) ? 'R$ 0,00' : num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Função auxiliar para formatar percentual
  const formatPercent = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0,00%' : `${num.toFixed(2)}%`;
  };

  // Função auxiliar para formatar número
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0,00' : num.toFixed(2);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate('/marketing/facebook')}>
          <FiArrowLeft /> Voltar
        </button>
        <h1>{id ? 'Editar Registro' : 'Novo Registro'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="marketing-form">
        <div className="form-content">
          <div className="input-section">
            <h2>
              <FiCalendar className="section-icon" /> Dados de Entrada
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <FiCalendar className="field-icon" /> Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiDollarSign className="field-icon" /> Invest. Realizado (R$)
                </label>
                <input
                  type="number"
                  name="invest_realizado"
                  value={formData.invest_realizado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiTarget className="field-icon" /> Invest. Projetado (R$)
                </label>
                <input
                  type="number"
                  name="invest_projetado"
                  value={formData.invest_projetado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendas_facebook">
                  <FiBarChart2 className="field-icon" /> Vendas Facebook (R$)
                </label>
                <input
                  type="number"
                  name="vendas_facebook"
                  id="vendas_facebook"
                  value={formData.vendas_facebook}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiTrendingUp className="field-icon" /> Fat. Projetado (R$)
                </label>
                <input
                  type="number"
                  name="fat_proj"
                  value={formData.fat_proj}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiDollarSign className="field-icon" /> Fat. Campanha Realizado (R$)
                </label>
                <input
                  type="number"
                  name="fat_camp_realizado"
                  value={formData.fat_camp_realizado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                  className={fieldErrors.fat_camp_realizado ? 'error' : ''}
                />
                {fieldErrors.fat_camp_realizado && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {fieldErrors.fat_camp_realizado}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <FiBarChart2 className="field-icon" /> Fat. Geral (R$)
                </label>
                <input
                  type="number"
                  name="fat_geral"
                  value={formData.fat_geral}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiShoppingCart className="field-icon" /> Ticket Médio Realizado (R$)
                </label>
                <input
                  type="number"
                  name="ticket_medio_realizado"
                  value={formData.ticket_medio_realizado}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiUsers className="field-icon" /> Leads
                </label>
                <input
                  type="number"
                  name="leads"
                  value={formData.leads}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiUsers className="field-icon" /> Clientes Novos
                </label>
                <input
                  type="number"
                  name="clientes_novos"
                  value={formData.clientes_novos}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiUsers className="field-icon" /> Clientes Recorrentes
                </label>
                <input
                  type="number"
                  name="clientes_recorrentes"
                  value={formData.clientes_recorrentes}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <FiPercent className="field-icon" /> Conversões
                </label>
                <input
                  type="number"
                  name="conversoes"
                  value={formData.conversoes}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="results-section">
            <h2>
              <FiTrendingUp className="section-icon" /> Resultados Calculados
            </h2>
            <div className="results-grid">
              <div className="result-group">
                <h3>
                  <FiCalendar className="section-icon" />
                  Informações Temporais
                </h3>
                <div className="result-item">
                  <label>Mês</label>
                  <span className="result-value">{formData.mes || '-'}</span>
                </div>
                <div className="result-item">
                  <label>Ano</label>
                  <span className="result-value">{formData.ano || '-'}</span>
                </div>
                <div className="result-item">
                  <label>Semana</label>
                  <span className="result-value">{formData.semana || '-'}</span>
                </div>
              </div>

              <div className="result-group">
                <h3>
                  <FiDollarSign className="section-icon" />
                  Saldos
                </h3>
                <div className="result-item">
                  <label>Saldo Investimento</label>
                  <span className="result-value">{formatCurrency(formData.saldo_invest)}</span>
                </div>
                <div className="result-item">
                  <label>Saldo Faturamento</label>
                  <span className="result-value">{formatCurrency(formData.saldo_fat)}</span>
                </div>
              </div>

              <div className="result-group">
                <h3>
                  <FiTrendingUp className="section-icon" />
                  Indicadores de Performance
                </h3>
                <div className="result-item">
                  <label>ROI Realizado</label>
                  <span className="result-value">{formatPercent(formData.roi_realizado)}</span>
                </div>
                <div className="result-item">
                  <label>ROAS Realizado</label>
                  <span className="result-value">{formatNumber(formData.roas_realizado)}</span>
                </div>
                <div className="result-item">
                  <label>CAC Realizado</label>
                  <span className="result-value">{formatCurrency(formData.cac_realizado)}</span>
                </div>
              </div>

              <div className="result-group">
                <h3>
                  <FiUsers className="section-icon" />
                  Métricas de Cliente
                </h3>
                <div className="result-item">
                  <label>ARPU Realizado</label>
                  <span className="result-value">{formatCurrency(formData.arpu_realizado)}</span>
                </div>
                <div className="result-item">
                  <label>Taxa de Conversão</label>
                  <span className="result-value">{formatPercent(formData.taxa_conversao)}</span>
                </div>
                <div className="result-item">
                  <label>Clima</label>
                  <span className="result-value">{formData.clima || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="form-footer">
          <button type="submit" className="btn-save" disabled={loading}>
            <FiSave /> {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default FacebookForm; 