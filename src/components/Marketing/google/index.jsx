import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GoogleList from './List/GoogleList';
import GoogleForm from './Form/GoogleForm';
import GoogleDashboard from './Dashboard/GoogleDashboard';
import Detail from './Detail/Detail';
import Delete from './Delete/Delete';

const Google = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="preencher-semana" replace />} />
      <Route path="preencher-semana" element={<GoogleList />} />
      <Route path="novo" element={<GoogleForm />} />
      <Route path="dashboard" element={<GoogleDashboard />} />
      <Route path="detalhe/:id" element={<Detail />} />
      <Route path="editar/:id" element={<GoogleForm />} />
      <Route path="excluir/:id" element={<Delete />} />
    </Routes>
  );
};

export default Google; 