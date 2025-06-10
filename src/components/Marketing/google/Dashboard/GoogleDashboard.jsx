import React, { useState, useEffect } from 'react';
import { vendaService } from '../../../../services/vendaService';
import { formatCurrency, formatNumber, formatPercentage } from '../../../../utils/formatters';
import { 
  FiRefreshCw,
  FiFilter,
  FiSettings,
  FiX,
  FiEye,
  FiEyeOff,
  FiChevronUp,
  FiChevronDown,
  FiCalendar
} from 'react-icons/fi';
import MonthlyMetricCard from './MonthlyMetricCard';
import WeeklyDashboard from './WeeklyDashboard';
import './GoogleDashboard.css';

const GoogleDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: 1,
    filterType: 'mes'
  });
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customization, setCustomization] = useState({
    cards: {
      faturamento: { visible: true, order: 1 },
      clientes_novos: { visible: true, order: 2 },
      faturamento_campanha: { visible: true, order: 3 },
      leads: { visible: true, order: 4 },
      vendas_google: { visible: true, order: 5 },
      roi: { visible: true, order: 6 },
      ticket_medio: { visible: true, order: 7 },
      clientes_recorrentes: { visible: true, order: 8 },
      taxa_conversao: { visible: true, order: 9 },
      cac: { visible: true, order: 10 }
    },
    charts: {
      investimento: { visible: true, order: 1 },
      faturamento: { visible: true, order: 2 },
      roi: { visible: true, order: 3 },
      leads: { visible: true, order: 4 },
      ticket_medio: { visible: true, order: 5 },
      clientes_novos: { visible: true, order: 6 },
      clientes_recorrentes: { visible: true, order: 7 },
      vendas_google: { visible: true, order: 8 },
      taxa_conversao: { visible: true, order: 9 },
      cac: { visible: true, order: 10 }
    }
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca dados do período atual
      const data = await vendaService.getDashboardData({ ...filters, plataforma: 'google' });
      setDashboardData(data);

      // Busca dados históricos do ano todo para médias
      const historicalFilters = {
        year: filters.year,
        filterType: 'ano',
        plataforma: 'google'
      };
      const historicalData = await vendaService.getDashboardData(historicalFilters);
      setHistoricalData(historicalData);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (metric) => {
    if (!historicalData) return 0;
    
    // Pega o array de dados históricos correspondente
    const dataArray = historicalData[`${metric}_data`];
    if (!dataArray || dataArray.length === 0) return 0;

    // Filtra valores válidos (diferentes de zero)
    const validValues = dataArray.filter(value => value !== 0);
    if (validValues.length === 0) return 0;

    // Calcula a média
    const sum = validValues.reduce((a, b) => a + b, 0);
    return sum / validValues.length;
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };
      
      // Reset week when changing filter type
      if (key === 'filterType') {
        newFilters.week = value === 'semana' ? 1 : null;
      }
      
      return newFilters;
    });
  };

  const toggleCustomizeModal = () => {
    setShowCustomizeModal(!showCustomizeModal);
  };

  const toggleCardVisibility = (cardId) => {
    setCustomization(prev => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: {
          ...prev.cards[cardId],
          visible: !prev.cards[cardId].visible
        }
      }
    }));
  };

  const toggleChartVisibility = (chartId) => {
    setCustomization(prev => ({
      ...prev,
      charts: {
        ...prev.charts,
        [chartId]: {
          ...prev.charts[chartId],
          visible: !prev.charts[chartId].visible
        }
      }
    }));
  };

  const moveItem = (type, id, direction) => {
    const listType = type === 'cards' ? 'cards' : 'charts';
    const currentList = Object.entries(customization[listType])
      .sort(([, a], [, b]) => a.order - b.order);
    
    const currentIndex = currentList.findIndex(([itemId]) => itemId === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentList.length) return;
    
    // Troca as posições
    const newList = [...currentList];
    [newList[currentIndex], newList[newIndex]] = [newList[newIndex], newList[currentIndex]];
    
    // Atualiza as ordens
    const updatedList = {};
    newList.forEach(([itemId, config], index) => {
      updatedList[itemId] = {
        ...config,
        order: index + 1
      };
    });
    
    setCustomization(prev => ({
      ...prev,
      [listType]: updatedList
    }));
  };

  // Função para calcular o número da semana do ano
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Função para calcular as semanas do mês
  const getWeeksInMonth = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // Array para armazenar as semanas
    const weeks = [];
    
    // Data atual para iteração
    let currentDate = new Date(firstDay);
    
    // Enquanto estivermos no mesmo mês
    while (currentDate.getMonth() === month - 1) {
      const weekNumber = getWeekNumber(currentDate);
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
      
      // Só adiciona a semana se ela ainda não foi adicionada
      if (!weeks.find(w => w.number === weekNumber)) {
        weeks.push({
          number: weekNumber,
          start: weekStart,
          end: new Date(Math.min(weekEnd, lastDay))
        });
      }
      
      // Avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weeks.sort((a, b) => a.number - b.number);
  };

  const CustomizeModal = () => (
    <div className="customize-modal-overlay">
      <div className="customize-modal">
        <div className="customize-modal-header">
          <h2>Personalizar Dashboard</h2>
          <button onClick={toggleCustomizeModal} className="close-button">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="customize-modal-content">
          <div className="customize-section">
            <h3>Cards</h3>
            <div className="customize-items">
              {Object.entries(customization.cards)
                .sort(([, a], [, b]) => a.order - b.order)
                .map(([cardId, config], index, array) => (
                  <div key={`card-${cardId}`} className="customize-item">
                    <div className="item-controls">
                      <button 
                        className="move-button"
                        onClick={() => moveItem('cards', cardId, 'up')}
                        disabled={index === 0}
                      >
                        <FiChevronUp size={20} />
                      </button>
                      <button 
                        className="move-button"
                        onClick={() => moveItem('cards', cardId, 'down')}
                        disabled={index === array.length - 1}
                      >
                        <FiChevronDown size={20} />
                      </button>
                    </div>
                    <button 
                      className={`visibility-toggle ${config.visible ? 'visible' : ''}`}
                      onClick={() => toggleCardVisibility(cardId)}
                    >
                      {config.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </button>
                    <span>{cardId.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="customize-section">
            <h3>Gráficos</h3>
            <div className="customize-items">
              {Object.entries(customization.charts)
                .sort(([, a], [, b]) => a.order - b.order)
                .map(([chartId, config], index, array) => (
                  <div key={`chart-${chartId}`} className="customize-item">
                    <div className="item-controls">
                      <button 
                        className="move-button"
                        onClick={() => moveItem('charts', chartId, 'up')}
                        disabled={index === 0}
                      >
                        <FiChevronUp size={20} />
                      </button>
                      <button 
                        className="move-button"
                        onClick={() => moveItem('charts', chartId, 'down')}
                        disabled={index === array.length - 1}
                      >
                        <FiChevronDown size={20} />
                      </button>
                    </div>
                    <button 
                      className={`visibility-toggle ${config.visible ? 'visible' : ''}`}
                      onClick={() => toggleChartVisibility(chartId)}
                    >
                      {config.visible ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                    </button>
                    <span>{chartId.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="customize-actions">
            <button className="save-button" onClick={toggleCustomizeModal}>
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <FiRefreshCw className="loading-icon" />
        <span>Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <span>{error}</span>
        <button onClick={fetchDashboardData}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="google-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Dashboard Google Ads</h1>
          <p className="subtitle">Análise de desempenho das campanhas</p>
        </div>
        <div className="header-controls">
          <div className="header-filters">
            <div className="filter-group">
              <FiCalendar className="filter-icon" />
              <select 
                value={filters.year} 
                onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
                title="Selecione o ano"
              >
                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <FiFilter className="filter-icon" />
              <select 
                value={filters.filterType} 
                onChange={(e) => handleFilterChange('filterType', e.target.value)}
                title="Selecione o tipo de filtro"
              >
                <option value="ano">Anual</option>
                <option value="mes">Mensal</option>
                <option value="semana">Semanal</option>
              </select>
            </div>
            
            {filters.filterType !== 'ano' && (
              <div className="filter-group">
                <FiCalendar className="filter-icon" />
                <select 
                  value={filters.month} 
                  onChange={(e) => handleFilterChange('month', parseInt(e.target.value))}
                  title="Selecione o mês"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>
                      {new Date(2000, month - 1).toLocaleString('pt-BR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {filters.filterType === 'semana' && (
              <div className="filter-group">
                <FiCalendar className="filter-icon" />
                <select 
                  value={filters.week} 
                  onChange={(e) => handleFilterChange('week', parseInt(e.target.value))}
                  title="Selecione a semana"
                >
                  {getWeeksInMonth(filters.year, filters.month).map((week) => (
                    <option key={week.number} value={week.number}>
                      Semana {week.number} ({week.start.getDate()}/{week.start.getMonth() + 1} - {week.end.getDate()}/{week.end.getMonth() + 1})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button className="customize-button" onClick={toggleCustomizeModal}>
              <FiSettings style={{ marginRight: '0.5rem' }} />
              Personalizar
            </button>
          </div>
        </div>
      </div>

      {filters.filterType === 'semana' ? (
        <WeeklyDashboard 
          dashboardData={dashboardData}
          customization={customization}
        />
      ) : (
        <MonthlyMetricCard 
          dashboardData={dashboardData}
          customization={customization}
        />
      )}

      {showCustomizeModal && <CustomizeModal />}
    </div>
  );
};

export default GoogleDashboard; 