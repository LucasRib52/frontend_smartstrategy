import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '../../../../../utils/formatters';

const RechartLine = ({ title, labels = [], datasets = [] }) => {
  // Validação dos dados
  if (!labels.length || !datasets.length) {
    return (
      <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Nenhum dado disponível para exibição</p>
      </div>
    );
  }

  // Prepara os dados no formato que o Recharts espera
  const data = labels.map((label, index) => {
    const dataPoint = { name: label };
    datasets.forEach(dataset => {
      if (dataset && dataset.data && dataset.data[index] !== undefined) {
        dataPoint[dataset.label] = dataset.data[index];
      } else {
        dataPoint[dataset.label] = 0;
      }
    });
    return dataPoint;
  });

  // Cores customizadas para as linhas
  const colors = [
    '#00B5B5', // Verde água
    '#8B5CF6', // Roxo
    '#F59E0B', // Laranja
    '#EF4444', // Vermelho
    '#60A5FA', // Azul
    '#34D399', // Verde
    '#A78BFA', // Roxo claro
    '#F87171', // Vermelho claro
    '#FCD34D'  // Amarelo
  ];

  // Função para formatar o valor no tooltip baseado no tipo de dado
  const formatValue = (value, dataKey) => {
    if (!value && value !== 0) return 'N/A';
    
    if (dataKey.toLowerCase().includes('roi') || dataKey.toLowerCase().includes('taxa')) {
      return formatPercentage(value);
    } else if (
      dataKey.toLowerCase().includes('leads') || 
      dataKey.toLowerCase().includes('clientes')
    ) {
      return formatNumber(value);
    }
    return formatCurrency(value);
  };

  // Componente customizado para o Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatValue(entry.value, entry.name)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(value) => {
              // Verifica se algum dataset é de porcentagem
              if (datasets.some(d => 
                d.label.toLowerCase().includes('roi') || 
                d.label.toLowerCase().includes('taxa')
              )) {
                return formatPercentage(value);
              }
              // Verifica se é contagem
              if (datasets.some(d => 
                d.label.toLowerCase().includes('leads') || 
                d.label.toLowerCase().includes('clientes')
              )) {
                return formatNumber(value);
              }
              return formatCurrency(value);
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px'
            }}
          />
          {datasets.map((dataset, index) => (
            <Line
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.borderColor || colors[index % colors.length]}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: '#fff'
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2
              }}
              strokeDasharray={dataset.borderDash ? "5 5" : ""}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartLine; 