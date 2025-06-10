import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../components/auth/Login/Login';
import Register from '../components/auth/Register/Register';
import PrivateRoute from '../components/auth/PrivateRoute/PrivateRoute';
import Google from '../components/Marketing/google';
import Instagram from '../components/Marketing/instagram';
import Facebook from '../components/Marketing/facebook';
import Empresas from '../components/Configuracoes/Empresas';
import Empresas_PessoaFisica from '../components/Configuracoes/Empresas_PessoaFisica/Empresas_PessoaFisica';
import Usuarios from '../components/Configuracoes/Usuarios';
import PJRoute from '../components/auth/PrivateRoute/PJRoute';
import PFRoute from '../components/auth/PrivateRoute/PFRoute';
import SelecionarEmpresaPF from '../components/SelecionarEmpresapf/SelecionarEmpresaPF';
import PerfilUsuario from '../components/PerfilUsuario/PerfilUsuario';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../components/Home/HomePage';
import Financeiro from '../components/Financeiro/Financeiro';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/selecionar-empresa',
    element: <SelecionarEmpresaPF />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout>
          <Outlet />
        </MainLayout>
      </PrivateRoute>
    ),
    children: [
      // Rotas que não requerem empresa
      {
        path: 'perfil',
        element: <PerfilUsuario />
      },
      {
        path: 'home',
        element: <HomePage />
      },

      // Rotas de configurações
      {
        path: 'configuracoes/empresas',
        element: (
          <PJRoute>
            <Empresas />
          </PJRoute>
        )
      },
      {
        path: 'configuracoes/empresas-pf',
        element: <Empresas_PessoaFisica />
      },
      {
        path: 'configuracoes/usuarios',
        element: (
          <ProtectedRoute>
            <PJRoute>
              <Usuarios />
            </PJRoute>
          </ProtectedRoute>
        )
      },

      // Rotas que requerem empresa
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <PFRoute>
            <Navigate to="/marketing/google/preencher-semana" replace />
            </PFRoute>
          </ProtectedRoute>
        )
      },
      {
        path: 'marketing/google/*',
        element: (
          <ProtectedRoute>
            <PFRoute>
            <Google />
            </PFRoute>
          </ProtectedRoute>
        )
      },
      {
        path: 'marketing/instagram/*',
        element: (
          <ProtectedRoute>
            <PFRoute>
            <Instagram />
            </PFRoute>
          </ProtectedRoute>
        )
      },
      {
        path: 'marketing/facebook/*',
        element: (
          <ProtectedRoute>
            <PFRoute>
            <Facebook />
            </PFRoute>
          </ProtectedRoute>
        )
      },
      {
        path: 'financeiro',
        element: (
          <ProtectedRoute>
            <PFRoute>
            <Financeiro />
            </PFRoute>
          </ProtectedRoute>
        )
      }
    ]
  }
]);

export default router; 