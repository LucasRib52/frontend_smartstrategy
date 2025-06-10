import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PJRoute({ children }) {
  let isPJ = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    isPJ = user?.user?.user_type === 'PJ';
  } catch {}
  if (!isPJ) {
    return <Navigate to="/configuracoes/empresas" replace />;
  }
  return children;
} 