// Importações de bibliotecas e componentes necessários
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiPlus, FiEye, FiEdit2, FiTrash2, FiFilter, FiX, FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow } from 'react-icons/wi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vendaService } from '../../../../services/vendaService';
import './GoogleList.css';

// Componente principal da lista do Google Marketing
const GoogleList = () => {
  const navigate = useNavigate(); // Hook para navegação entre rotas
  
  // Estados para controle de datas do filtro
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  // Estado para controle da página atual da paginação
  const [currentPage, setCurrentPage] = useState(1);
  // Estado para armazenar todos os dados vindos da API
  const [data, setData] = useState([]);
  // Estado para armazenar os dados filtrados
  const [filteredData, setFilteredData] = useState([]);
  // Estado de loading para exibir spinner enquanto carrega
  const [loading, setLoading] = useState(true);
  // Estado para exibir mensagens de erro
  const [error, setError] = useState(null);
  // Total de páginas para paginação
  const [totalPages, setTotalPages] = useState(0);
  // Total de itens exibidos
  const [totalItems, setTotalItems] = useState(0);
  // Controle de exibição da seção de filtros
  const [showFilters, setShowFilters] = useState(false);
  // Quantidade de itens por página
  const itemsPerPage = 10;

  // useEffect para buscar dados ao carregar ou mudar de página
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // Atualiza os dados filtrados sempre que os dados mudam
  useEffect(() => {
    const filtered = data.filter(item => Number(item.vendas_google) > 0);
    setFilteredData(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [data]);

  // Função para buscar todos os dados da API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vendaService.getAll();
      // Corrigido: garantir que processedData seja sempre um array de vendas
      let processedData = [];
      if (response && Array.isArray(response.data)) {
        processedData = response.data;
      } else if (response && response.data && Array.isArray(response.data.results)) {
        processedData = response.data.results;
      } else if (Array.isArray(response)) {
        processedData = response;
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

  // Função para exportar dados em CSV
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

  // Função para exportar dados em Excel
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

  // Função para aplicar o filtro de datas
  const handleApplyFilters = () => {
    if (startDate && endDate) {
      const filtered = data.filter(item => {
        if (!item.data) return false;
        const itemDate = new Date(item.data);
        // Zera horas para comparar só a data
        itemDate.setHours(0,0,0,0);
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0,0,0,0);
        end.setHours(0,0,0,0);
        return itemDate >= start && itemDate <= end;
      });
      setFilteredData(filtered);
      setCurrentPage(1);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    } else {
      setFilteredData(data);
      setCurrentPage(1);
      setTotalItems(data.length);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    }
  };

  // Função para limpar o filtro de datas
  const handleClearFilters = () => {
    setDateRange([null, null]);
    setFilteredData(data);
    setCurrentPage(1);
    setTotalItems(data.length);
    setTotalPages(Math.ceil(data.length / itemsPerPage));
  };

  // Calcula os dados da página atual a partir dos dados filtrados
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Função para formatar valores como moeda brasileira
  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Função para retornar o ícone do clima conforme o valor
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

  // Função para mudar de página na paginação
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Função para renderizar os botões de paginação
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

  // Renderização do componente
  return (
    <div className="google-list">
      {/* Cabeçalho do dashboard */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>📊 Dashboard de Marketing</h1>
          <p className="subtitle">Acompanhamento de Campanhas Google</p>
        </div>
        
        <div className="header-actions">
          {/* Botão para abrir/fechar filtros */}
          <button className="btn-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filtros {showFilters ? 'ativos' : ''}
          </button>
          {/* Botões de exportação */}
          <div className="export-buttons">
            <button className="btn-export" onClick={handleExportCSV} title="Exportar para CSV">
              <FiDownload /> CSV
            </button>
            <button className="btn-export" onClick={handleExportExcel} title="Exportar para Excel">
              <FiDownload /> Excel
            </button>
          </div>
          {/* Botão para criar nova campanha */}
          <button className="btn-new" onClick={() => navigate('/marketing/google/novo')}>
            <FiPlus /> Nova Campanha
          </button>
        </div>
      </div>

      {/* Seção de filtros (data) */}
      <div className={`filter-section ${showFilters ? 'show' : ''}`}>
        <div className="filter-content">
          <div className="date-picker-wrapper">
            <div className="date-picker-label">
              <FiCalendar />
              <span>Período da Campanha</span>
            </div>
            {/* Componente de seleção de período (DatePicker) */}
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              isClearable={true}
              placeholderText="Selecione o período"
              dateFormat="dd/MM/yyyy"
              className="date-input"
              withPortal
            />
          </div>
          
          {/* Botões de aplicar e limpar filtro */}
          <div className="filter-actions">
            <button className="btn-apply" onClick={handleApplyFilters}>
              <FiFilter /> Aplicar Filtros
            </button>
            <button className="btn-clear" onClick={handleClearFilters}>
              <FiX /> Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal: tabela ou estados de loading/erro/vazio */}
      <div className="content-wrapper">
        {loading ? (
          // Estado de carregamento
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : error ? (
          // Estado de erro
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchData}>Tentar Novamente</button>
          </div>
        ) : data.length === 0 ? (
          // Estado de vazio (sem dados)
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>Nenhum dado encontrado</p>
            <button className="btn-new" onClick={() => navigate('/marketing/google/novo')}>
              <FiPlus /> Criar Primeira Campanha
            </button>
          </div>
        ) : (
          // Tabela de dados
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
                    <th>Vendas Google</th>
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
                  {/* Renderiza cada linha da tabela com os dados filtrados e paginados */}
                  {currentData.map((item) => (
                    <tr key={item.id}>
                      <td>{item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>{item.mes && item.ano ? `${item.mes}/${item.ano}` : '-'}</td>
                      <td data-type="number">{item.semana || '-'}</td>
                      <td data-type="currency">{item.invest_realizado ? formatCurrency(item.invest_realizado) : '-'}</td>
                      <td data-type="currency">{item.invest_projetado ? formatCurrency(item.invest_projetado) : '-'}</td>
                      <td data-type="currency">{item.saldo_invest ? formatCurrency(item.saldo_invest) : '-'}</td>
                      <td data-type="currency">{item.vendas_google ? formatCurrency(item.vendas_google) : '-'}</td>
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
                        {/* Botões de ação: visualizar, editar, excluir */}
                        <div className="action-buttons">
                          <button 
                            className="btn-action view" 
                            title="Visualizar Detalhes"
                            onClick={() => navigate(`/marketing/google/detalhe/${item.id}`)}
                          >
                            <FiEye />
                          </button>
                          <button 
                            className="btn-action edit" 
                            title="Editar Campanha"
                            onClick={() => navigate(`/marketing/google/editar/${item.id}`)}
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="btn-action delete" 
                            title="Excluir Campanha"
                            onClick={() => navigate(`/marketing/google/excluir/${item.id}`)}
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

            {/* Rodapé da tabela com paginação */}
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
                  {/* Botão página anterior */}
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft />
                  </button>
                  
                  {/* Botões de páginas */}
                  {renderPaginationButtons()}
                  
                  {/* Botão próxima página */}
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

// Exporta o componente para uso em outros lugares
export default GoogleList; 
