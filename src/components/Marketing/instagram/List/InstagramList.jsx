import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiPlus, FiEye, FiEdit2, FiTrash2, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow } from 'react-icons/wi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vendaService } from '../../../../services/vendaService';
import '../../google/List/GoogleList.css';

const InstagramList = () => {
  const navigate = useNavigate();
  
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const filtered = data.filter(item => Number(item.vendas_instagram) > 0);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vendaService.getAll();
      
      let processedData = [];
      
      if (Array.isArray(response)) {
        processedData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        processedData = response.data;
      } else if (response && typeof response === 'object') {
        const possibleArrays = Object.values(response).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          processedData = possibleArrays[0];
        } else {
          processedData = [response];
        }
      }
      
      setData(processedData);
      setTotalItems(processedData.length);
      setTotalPages(Math.ceil(processedData.length / itemsPerPage));
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os dados: ' + err.message);
      setData([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await vendaService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vendas.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await vendaService.exportExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vendas.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar Excel:', err);
    }
  };

  const filteredData = data.filter(item => Number(item.vendas_instagram) > 0);
  const currentData = filteredData;

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getWeatherIcon = (clima) => {
    if (!clima) return null;
    
    const weatherClass = clima.toLowerCase();
    switch (weatherClass) {
      case 'ensolarado':
        return { icon: <WiDaySunny className="weather-icon sunny" />, class: 'sunny' };
      case 'nublado':
        return { icon: <WiCloudy className="weather-icon cloudy" />, class: 'cloudy' };
      case 'chuvoso':
        return { icon: <WiRain className="weather-icon rainy" />, class: 'rainy' };
      case 'tempestade':
        return { icon: <WiThunderstorm className="weather-icon stormy" />, class: 'stormy' };
      case 'nevando':
        return { icon: <WiSnow className="weather-icon snowy" />, class: 'snowy' };
      default:
        return null;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="google-list">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>📊 Dashboard de Marketing</h1>
          <p className="subtitle">Acompanhamento de Campanhas Instagram</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filtros {showFilters ? 'ativos' : ''}
          </button>
          <div className="export-buttons">
            <button className="btn-export" onClick={handleExportCSV} title="Exportar para CSV">
              <FiDownload /> CSV
            </button>
            <button className="btn-export" onClick={handleExportExcel} title="Exportar para Excel">
              <FiDownload /> Excel
            </button>
          </div>
          <button className="btn-new" onClick={() => navigate('/marketing/instagram/novo')}>
            <FiPlus /> Nova Campanha
          </button>
        </div>
      </div>

      <div className={`filter-section ${showFilters ? 'show' : ''}`}>
        <div className="filter-content">
          <div className="date-picker-wrapper">
            <div className="date-picker-label">
              <FiCalendar />
              <span>Período da Campanha</span>
            </div>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Selecione o período"
              dateFormat="dd/MM/yyyy"
              className="date-input"
            />
          </div>
          
          <div className="filter-actions">
            <button className="btn-apply">
              <FiFilter /> Aplicar Filtros
            </button>
            <button className="btn-clear">
              <FiX /> Limpar
            </button>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchData}>Tentar Novamente</button>
          </div>
        ) : data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>Nenhum dado encontrado</p>
            <button className="btn-new" onClick={() => navigate('/marketing/instagram/novo')}>
              <FiPlus /> Criar Primeira Campanha
            </button>
          </div>
        ) : (
          <div className="table-container">
            <div className="table-scroll">
              <table className="marketing-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Mês/Ano</th>
                    <th>Semana</th>
                    <th>Invest. Realizado</th>
                    <th>Invest. Projetado</th>
                    <th>Saldo Invest.</th>
                    <th>Vendas Instagram</th>
                    <th>FAT Projetado</th>
                    <th>FAT Campanha</th>
                    <th>FAT Geral</th>
                    <th>ROI</th>
                    <th>ROAS</th>
                    <th>CAC</th>
                    <th>TKT Médio</th>
                    <th>Leads</th>
                    <th>Conversões</th>
                    <th>Taxa Conv.</th>
                    <th>Clima</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{item.mes && item.ano ? `${item.mes}/${item.ano}` : '-'}</td>
                      <td data-type="number">{item.semana || '-'}</td>
                      <td data-type="currency">{item.invest_realizado ? formatCurrency(item.invest_realizado) : '-'}</td>
                      <td data-type="currency">{item.invest_projetado ? formatCurrency(item.invest_projetado) : '-'}</td>
                      <td data-type="currency">{item.saldo_invest ? formatCurrency(item.saldo_invest) : '-'}</td>
                      <td data-type="currency">{item.vendas_instagram ? formatCurrency(item.vendas_instagram) : '-'}</td>
                      <td data-type="currency">{item.fat_proj ? formatCurrency(item.fat_proj) : '-'}</td>
                      <td data-type="currency">{item.fat_camp_realizado ? formatCurrency(item.fat_camp_realizado) : '-'}</td>
                      <td data-type="currency">{item.fat_geral ? formatCurrency(item.fat_geral) : '-'}</td>
                      <td data-type="number">{item.roi_realizado != null ? Number(item.roi_realizado).toFixed(2) : '-'}</td>
                      <td data-type="number">{item.roas_realizado != null ? Number(item.roas_realizado).toFixed(2) : '-'}</td>
                      <td data-type="currency">{item.cac_realizado ? formatCurrency(item.cac_realizado) : '-'}</td>
                      <td data-type="currency">{item.ticket_medio_realizado ? formatCurrency(item.ticket_medio_realizado) : '-'}</td>
                      <td data-type="number">{item.leads || '-'}</td>
                      <td data-type="number">{item.conversoes || '-'}</td>
                      <td data-type="percentage">{item.taxa_conversao != null ? `${Number(item.taxa_conversao).toFixed(2)}%` : '-'}</td>
                      <td className="weather-cell-container">
                        {item.clima && (
                          <div className={`weather-cell ${getWeatherIcon(item.clima)?.class || ''}`}>
                            {getWeatherIcon(item.clima)?.icon}
                            <span>{item.clima}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-action view" 
                            title="Visualizar Detalhes"
                            onClick={() => navigate(`/marketing/instagram/detalhes/${item.id}`)}
                          >
                            <FiEye />
                          </button>
                          <button 
                            className="btn-action edit" 
                            title="Editar Campanha"
                            onClick={() => navigate(`/marketing/instagram/editar/${item.id}`)}
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="btn-action delete" 
                            title="Excluir Campanha"
                            onClick={() => navigate(`/marketing/instagram/excluir/${item.id}`)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <div className="pagination">
                <div className="pagination-info">
                  <span>Mostrando </span>
                  <strong>{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong>
                  <span> até </span>
                  <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong>
                  <span> de </span>
                  <strong>{totalItems}</strong>
                  <span> registros</span>
                </div>
                <div className="pagination-controls">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {renderPaginationButtons()}
                  
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagramList; 