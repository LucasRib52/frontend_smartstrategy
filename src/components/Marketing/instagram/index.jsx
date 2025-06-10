import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InstagramList from './List/InstagramList';
import InstagramForm from './Form/InstagramForm';
import InstagramDetail from './Detail/DetailInstagram';
import InstagramDelete from './Delete/DeleteInstagram';
import InstagramDashboard from './Dashboard/InstagramDashboard';


const Instagram = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="preencher-semana" replace />} />
      <Route path="preencher-semana" element={<InstagramList />} />
      <Route path="novo" element={<InstagramForm />} />
      <Route path="dashboard" element={<InstagramDashboard />} />
      <Route path="editar/:id" element={<InstagramForm />} />
      <Route path="detalhes/:id" element={<InstagramDetail />} />
      <Route path="excluir/:id" element={<InstagramDelete />} />
    </Routes>
  );
};

export default Instagram; 