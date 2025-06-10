import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/auth/authService';
import './PrivateRoute.css';

/**
 * Componente de Rota Privada
 * Responsável por proteger rotas que requerem autenticação
 * Redireciona para a página de login se o usuário não estiver autenticado
 */
const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const auth = await authService.isAuthenticated();
                console.log('Status de autenticação:', auth);
                setIsAuthenticated(auth);
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="auth-private-route-loading">
                <div className="auth-private-route-spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        console.log('Usuário não autenticado, redirecionando para login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('Usuário autenticado, renderizando rota protegida');
    return children;
};

export default PrivateRoute; 