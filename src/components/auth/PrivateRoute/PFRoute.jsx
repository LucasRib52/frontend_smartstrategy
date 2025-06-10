import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PFRoute({ children }) {
  let isPF = false;
  let hasEmpresa = false;
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    // O usuário está em userData.user
    isPF = userData?.user?.user_type === 'PF';
    // Verifica tanto empresa_atual quanto empresaSelecionada
    hasEmpresa = !!(userData?.user?.empresa_atual || localStorage.getItem('empresaSelecionada'));
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
  }

  // Se é PF e não tem empresa, redireciona para selecionar
  if (isPF && !hasEmpresa) {
    console.log('Redirecionando para selecionar empresa:', { isPF, hasEmpresa });
    return <Navigate to="/selecionar-empresa" replace />;
  }

  return children;
} 