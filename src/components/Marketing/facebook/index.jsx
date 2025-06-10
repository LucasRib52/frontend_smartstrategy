import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacebookList from './List/FacebookList';
import FacebookForm from './Form/FacebookForm';
import FacebookDashboard from './Dashboard/FacebookDashboard';
import FacebookDetail from './Detail/FacebookDetail';
import FacebookDelete from './Delete/FacebookDelete';

const Facebook = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="preencher-semana" replace />} />
      <Route path="preencher-semana" element={<FacebookList />} />
      <Route path="novo" element={<FacebookForm />} />
      <Route path="dashboard" element={<FacebookDashboard />} />
      <Route path="detalhe/:id" element={<FacebookDetail />} />
      <Route path="editar/:id" element={<FacebookForm />} />
      <Route path="excluir/:id" element={<FacebookDelete />} />
    </Routes>
  );
};

export default Facebook; 