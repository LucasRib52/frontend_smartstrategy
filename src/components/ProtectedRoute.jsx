import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requireCompany = true }) => {
  const location = useLocation();
  const empresaSelecionada = localStorage.getItem('empresaSelecionada');
  let isPJ = false;
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem('user'));
    isPJ = user?.user?.user_type === 'PJ';
  } catch {}

  useEffect(() => {
    // Se o usuário for PF e estiver em uma rota que requer empresa
    if (!isPJ && requireCompany && !empresaSelecionada) {
      // Limpa a empresa selecionada para garantir consistência
      localStorage.removeItem('empresaSelecionada');
    }
  }, [location.pathname, isPJ, requireCompany, empresaSelecionada]);

  // Se a rota requer empresa e não há empresa selecionada
  if (requireCompany && !empresaSelecionada) {
    // Se for PJ, não redireciona para seleção de empresa
    if (isPJ) {
      return children;
    }
    // Se for PF, redireciona para a página de seleção
    return <Navigate to="/selecionar-empresa" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 