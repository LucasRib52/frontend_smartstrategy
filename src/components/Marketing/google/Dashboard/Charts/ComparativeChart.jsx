import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import { formatCurrency } from '../../../../../utils/formatters';

const ComparativeChart = ({ labels = [], datasets = [] }) => {
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

  // Calcula a média dos valores para cada métrica
  const averages = datasets.reduce((acc, dataset) => {
    const sum = dataset.data.reduce((a, b) => a + (b || 0), 0);
    acc[dataset.label] = sum / dataset.data.filter(v => v !== null && v !== undefined).length;
    return acc;
  }, {});

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#374151' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '4px',
              color: entry.color
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: entry.color,
                marginRight: '8px'
              }} />
              <span style={{ fontWeight: '500' }}>
                {entry.name}: {formatCurrency(entry.value)}
              </span>
            </div>
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
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#f0f0f0" 
            vertical={false}
          />
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
            tickFormatter={formatCurrency}
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
          {/* Linhas de média */}
          {Object.entries(averages).map(([label, value], index) => (
            <ReferenceLine
              key={`avg-${label}`}
              y={value}
              stroke={index === 0 ? '#00B5B5' : '#8B5CF6'}
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            >
              <Label 
                value={`Média ${label}`} 
                position="right"
                fill={index === 0 ? '#00B5B5' : '#8B5CF6'}
                fontSize={11}
              />
            </ReferenceLine>
          ))}
          {datasets.map((dataset, index) => (
            <Line
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.color || (index === 0 ? '#00B5B5' : '#8B5CF6')}
              strokeWidth={2.5}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: '#fff',
                stroke: dataset.color || (index === 0 ? '#00B5B5' : '#8B5CF6')
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: dataset.color || (index === 0 ? '#00B5B5' : '#8B5CF6'),
                fill: '#fff'
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparativeChart; 