import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '../../../../../utils/formatters';

const AreaChartComponent = ({ title, labels = [], datasets = [] }) => {
  if (!labels.length || !datasets.length) {
    return (
      <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Nenhum dado disponível para exibição</p>
      </div>
    );
  }

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

  const colors = [
    { fill: 'rgba(0, 181, 181, 0.2)', stroke: '#00B5B5' },
    { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#8B5CF6' },
    { fill: 'rgba(245, 158, 11, 0.2)', stroke: '#F59E0B' }
  ];

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
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10
          }}
        >
          <defs>
            {datasets.map((_, index) => (
              <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[index % colors.length].stroke} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[index % colors.length].stroke} stopOpacity={0}/>
              </linearGradient>
            ))}
          </defs>
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
              if (datasets.some(d => 
                d.label.toLowerCase().includes('roi') || 
                d.label.toLowerCase().includes('taxa')
              )) {
                return formatPercentage(value);
              }
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
            <Area
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke={colors[index % colors.length].stroke}
              fill={`url(#color${index})`}
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
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent; 