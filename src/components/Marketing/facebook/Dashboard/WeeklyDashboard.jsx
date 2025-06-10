import React from 'react';
import { formatCurrency, formatNumber, formatPercentage } from '../../../../utils/formatters';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiBarChart2,
  FiPercent,
  FiShoppingCart,
  FiCalendar
} from 'react-icons/fi';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { BsGraphUp, BsPeople } from 'react-icons/bs';
import { AiOutlinePercentage } from 'react-icons/ai';
import RechartLine from './Charts/RechartLine';
import AreaChartComponent from './Charts/AreaChart';
import BarChartComponent from './Charts/BarChart';
import ComparativeChart from './Charts/ComparativeChart';
import '../../../Marketing/google/Dashboard/GoogleDashboard.css';

const WeeklyDashboard = ({ dashboardData, customization }) => {
  const formatPercentValue = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0,00%';
    return `${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
  };

  const renderMetricCard = (icon, title, value, average, prefix = '', isPercentage = false) => {
    // Garante que os valores são números
    const numValue = Number(value) || 0;
    const numAverage = Number(average) || 0;
    
    const formatValue = (val) => {
      if (isPercentage) {
        return formatPercentValue(val);
      }
      if (prefix === 'R$ ') {
        return formatCurrency(val);
      }
      return formatNumber(val);
    };

    const formattedValue = formatValue(numValue);
    const formattedAverage = formatValue(numAverage);
    const isAboveAverage = numValue >= numAverage;
    
    return (
      <div className={`metric-card ${isAboveAverage ? 'up' : 'down'}`}>
        <div className="metric-header">
          {icon}
          <h3>{title}</h3>
        </div>
        <div className="metric-value">{formattedValue}</div>
        <div className={`metric-comparison ${isAboveAverage ? 'up' : 'down'}`}>
          {isAboveAverage ? '↑' : '↓'} {formattedAverage}
        </div>
      </div>
    );
  };

  return (
    <div className="google-dashboard">
      {/* Cards */}
      <div className="dashboard-cards">
        {Object.entries(customization.cards)
          .filter(([, config]) => config.visible)
          .sort(([, a], [, b]) => a.order - b.order)
          .map(([cardId, config]) => {
            const cardContent = (() => {
              switch (cardId) {
                case 'faturamento':
                  return renderMetricCard(
                    <MdOutlineAttachMoney className="metric-icon" />,
                    'Faturamento da Semana',
                    dashboardData?.faturamento || 0,
                    dashboardData?.faturamento_avg || 0,
                    'R$ '
                  );
                case 'clientes_novos':
                  return renderMetricCard(
                    <BsPeople className="metric-icon" />,
                    'Clientes Novos da Semana',
                    dashboardData?.clientes_novos || 0,
                    dashboardData?.clientes_novos_avg || 0
                  );
                case 'faturamento_campanha':
                  return renderMetricCard(
                    <BsGraphUp className="metric-icon" />,
                    'Fatur. Camp. da Semana',
                    dashboardData?.faturamento_campanha || 0,
                    dashboardData?.faturamento_campanha_avg || 0,
                    'R$ '
                  );
                case 'leads':
                  return renderMetricCard(
                    <FiUsers className="metric-icon" />,
                    'LEAD da Semana',
                    dashboardData?.leads || 0,
                    dashboardData?.leads_avg || 0
                  );
                case 'vendas_facebook':
                  return renderMetricCard(
                    <FiShoppingCart className="metric-icon" />,
                    'Vendas Facebook da Semana',
                    dashboardData?.vendas_facebook || 0,
                    dashboardData?.vendas_facebook_avg || 0,
                    'R$ '
                  );
                case 'roi':
                  return renderMetricCard(
                    <AiOutlinePercentage className="metric-icon" />,
                    'ROI da Semana',
                    dashboardData?.roi || 0,
                    dashboardData?.roi_avg || 0,
                    '',
                    true
                  );
                case 'ticket_medio':
                  return renderMetricCard(
                    <MdOutlineAttachMoney className="metric-icon" />,
                    'TKT. Med. da Semana',
                    dashboardData?.ticket_medio || 0,
                    dashboardData?.ticket_medio_avg || 0,
                    'R$ '
                  );
                case 'clientes_recorrentes':
                  return renderMetricCard(
                    <BsPeople className="metric-icon" />,
                    'Clientes Recor. da Semana',
                    dashboardData?.clientes_recorrentes || 0,
                    dashboardData?.clientes_recorrentes_avg || 0
                  );
                case 'taxa_conversao':
                  return renderMetricCard(
                    <FiPercent className="metric-icon" />,
                    'Taxa de conver. da Semana',
                    dashboardData?.taxa_conversao || 0,
                    dashboardData?.taxa_conversao_avg || 0,
                    '',
                    true
                  );
                case 'cac':
                  return renderMetricCard(
                    <MdOutlineAttachMoney className="metric-icon" />,
                    'CAC da Semana',
                    dashboardData?.cac || 0,
                    dashboardData?.cac_avg || 0,
                    'R$ '
                  );
                default:
                  return null;
              }
            })();

            return cardContent ? (
              <div key={cardId} className="metric-card-wrapper">
                {cardContent}
              </div>
            ) : null;
          })}
      </div>

      {/* Gráficos */}
      <div className="dashboard-charts">
        {Object.entries(customization.charts)
          .filter(([, config]) => config.visible)
          .sort(([, a], [, b]) => a.order - b.order)
          .map(([chartId, config]) => {
            switch (chartId) {
              case 'investimento':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Investimento</h3>
                    <AreaChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Invest. Realizado (R$)',
                          data: dashboardData?.invest_realizado_data,
                          borderColor: '#00B5B5'
                        },
                        {
                          label: 'Invest. Projetado (R$)',
                          data: dashboardData?.invest_projetado_data,
                          borderColor: '#EF4444'
                        },
                        {
                          label: 'Saldo Invest.',
                          data: dashboardData?.saldo_invest_data,
                          borderColor: '#9CA3AF'
                        }
                      ]}
                    />
                  </div>
                );
              case 'faturamento':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Faturamento</h3>
                    <BarChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Fat. Camp. (R$)',
                          data: dashboardData?.fat_camp_realizado_data,
                          borderColor: '#60A5FA'
                        },
                        {
                          label: 'Fat. Geral (R$)',
                          data: dashboardData?.fat_geral_data,
                          borderColor: '#93C5FD'
                        },
                        {
                          label: 'Saldo FAT',
                          data: dashboardData?.saldo_fat_data,
                          borderColor: '#9CA3AF'
                        }
                      ]}
                    />
                  </div>
                );
              case 'roi':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de ROI</h3>
                    <RechartLine
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'ROI Realizado',
                          data: dashboardData?.roi_data,
                          borderColor: '#8B5CF6'
                        },
                        {
                          label: 'Média ROI',
                          data: dashboardData?.labels.map(() => 59),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'leads':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de LEADS</h3>
                    <BarChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'LEADS',
                          data: dashboardData?.leads_data,
                          borderColor: '#A78BFA'
                        },
                        {
                          label: 'Média LEADS',
                          data: dashboardData?.labels.map(() => 35),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'ticket_medio':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Ticket Médio</h3>
                    <RechartLine
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Ticket Médio (R$)',
                          data: dashboardData?.ticket_medio_data,
                          borderColor: '#F59E0B'
                        },
                        {
                          label: 'Média Ticket Médio',
                          data: dashboardData?.labels.map(() => 456),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'clientes_novos':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Clientes Novos</h3>
                    <AreaChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Clientes Novos',
                          data: dashboardData?.clientes_novos_data,
                          borderColor: '#F87171'
                        },
                        {
                          label: 'Média Clientes Novos',
                          data: dashboardData?.labels.map(() => 55),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'clientes_recorrentes':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Clientes Recorrentes</h3>
                    <AreaChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Clientes Recorrentes',
                          data: dashboardData?.clientes_recorrentes_data,
                          borderColor: '#60A5FA'
                        },
                        {
                          label: 'Média Clientes Recorrentes',
                          data: dashboardData?.labels.map(() => 67),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'vendas_facebook':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Vendas Facebook</h3>
                    <BarChartComponent
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Vendas Facebook (R$)',
                          data: dashboardData?.vendas_facebook_data,
                          borderColor: '#9CA3AF'
                        },
                        {
                          label: 'Média Vendas Facebook',
                          data: dashboardData?.labels.map(() => dashboardData?.vendas_facebook_avg || 0),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'taxa_conversao':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de Taxa de Conversão</h3>
                    <RechartLine
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'Taxa de Conversão',
                          data: dashboardData?.taxa_conversao_data,
                          borderColor: '#F59E0B'
                        },
                        {
                          label: 'Média Taxa de Conversão',
                          data: dashboardData?.labels.map(() => 1.57),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              case 'cac':
                return (
                  <div key={chartId} className="chart-container">
                    <h3>Análise de CAC</h3>
                    <RechartLine
                      labels={dashboardData?.labels}
                      datasets={[
                        {
                          label: 'CAC Realizado (R$)',
                          data: dashboardData?.cac_data,
                          borderColor: '#FCD34D'
                        },
                        {
                          label: 'Média CAC',
                          data: dashboardData?.labels.map(() => 1.82),
                          borderColor: '#9CA3AF',
                          borderDash: [5, 5]
                        }
                      ]}
                    />
                  </div>
                );
              default:
                return null;
            }
          })}

        {/* Ticket Médio vs CAC */}
        <div className="chart-container">
          <h3>Ticket Médio vs CAC</h3>
          <ComparativeChart
            labels={dashboardData?.labels}
            datasets={[
              {
                label: 'CAC Realizado (R$)',
                data: dashboardData?.cac_data,
                color: '#60A5FA'
              },
              {
                label: 'Ticket Médio (R$)',
                data: dashboardData?.ticket_medio_data,
                color: '#4ADE80'
              }
            ]}
            averages={{
              'CAC Realizado (R$)': 1.82,
              'Ticket Médio (R$)': 456
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyDashboard; 