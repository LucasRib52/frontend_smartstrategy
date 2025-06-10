import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";
import { FiSearch, FiBell, FiClock, FiMoon, FiHome, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import ProfileDropdown from './ProfileDropdown/ProfileDropdown';
import { authService } from '../../services/auth/authService';
import { permissoesService } from '../../services/usuarios/permissoesService';
import ConviteNotificacao from '../ConviteNotificacao/ConviteNotificacao';
import api from '../../services/api';
import logo from '../../assets/images/logo.png';
import { toast } from 'react-toastify';

// Evento personalizado para notificar mudanças nas permissões
const PERMISSOES_ATUALIZADAS = 'permissoes-atualizadas';

/**
 * Componente Header - Barra superior da aplicação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onNavigate - Função para atualizar a seção ativa
 * @param {string} props.activeSection - Seção atual ativa
 * @returns {JSX.Element} Header com navegação e funcionalidades
 */
const Header = ({ onNavigate, activeSection }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    carregarFotoPerfil();
    carregarPermissoes();

    // Adiciona listener para o evento de atualização de permissões
    window.addEventListener(PERMISSOES_ATUALIZADAS, carregarPermissoes);

    // Remove o listener quando o componente é desmontado
    return () => {
      window.removeEventListener(PERMISSOES_ATUALIZADAS, carregarPermissoes);
    };
  }, []);

  const carregarFotoPerfil = async () => {
    try {
      const response = await api.get('/perfil/');
      if (response.data.foto) {
        setFotoPerfil(response.data.foto);
      }
    } catch (error) {
      console.error('Erro ao carregar foto do perfil:', error);
    }
  };

  const carregarPermissoes = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser?.user?.id) {
        console.error('Usuário não encontrado');
        setUserPermissions({});
        setLoading(false);
        return;
      }

      // Se for PJ, carrega as permissões
      if (currentUser.user.user_type === 'PJ') {
        try {
          const response = await api.get('/usuarios/links/');
          
          // Se não tem vínculo ativo, limpa as permissões
          if (!response.data || response.data.status !== 'accepted') {
            setUserPermissions({});
            setLoading(false);
            return;
          }

          // Usa o ID do vínculo para buscar as permissões
          const permissoesResponse = await permissoesService.obterModulosDisponiveis(response.data.id);
          
          // Processa as permissões
          const permissoes = {};
          if (Array.isArray(permissoesResponse)) {
            permissoesResponse.forEach(modulo => {
              permissoes[modulo.codigo] = modulo.tem_permissao;
            });
          }
          
          setUserPermissions(permissoes);
        } catch (error) {
          console.error('Erro ao carregar permissões:', error);
          setUserPermissions({});
        }
      } else {
        // Se for PF, verifica se está vinculado a alguma empresa
        try {
          const response = await api.get('/empresa_pessoafisica/empresas/');
          
          // Se não tem empresa vinculada, limpa as permissões
          if (!response.data || response.data.length === 0) {
            setUserPermissions({});
            setLoading(false);
            return;
          }

          // Pega a primeira empresa (já que PF só pode ter uma empresa ativa)
          const empresa = response.data[0];
          
          // Se não tem vínculo ativo, limpa as permissões
          if (!empresa || empresa.status !== 'accepted') {
            setUserPermissions({});
            setLoading(false);
            return;
          }

          // Usa o ID do vínculo para buscar as permissões
          const permissoesResponse = await permissoesService.obterModulosDisponiveis(empresa.link_id);
          
          // Processa as permissões
          const permissoes = {};
          if (Array.isArray(permissoesResponse)) {
            permissoesResponse.forEach(modulo => {
              permissoes[modulo.codigo] = modulo.tem_permissao;
            });
          }
          
          setUserPermissions(permissoes);
        } catch (error) {
          console.error('Erro ao carregar permissões:', error);
          setUserPermissions({});
        }
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setUserPermissions({});
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = async (modulo) => {
    try {
      const currentUser = authService.getCurrentUser();
      const isPJ = currentUser?.user?.user_type === 'PJ';

      // Se for PJ, tem acesso total aos módulos
      if (isPJ) {
        if (modulo === 'marketing') {
          navigate('/marketing/google/preencher-semana');
        } else if (modulo === 'financeiro') {
          navigate('/financeiro');
        }
        return;
      }

      // Se for PF, verifica se tem vínculo ativo
      try {
        const response = await api.get('/empresa_pessoafisica/empresas/');
        
        // Se não tem empresa vinculada, verifica se tem convite pendente
        if (!response.data || response.data.length === 0) {
          const convitesResponse = await api.get('/convite_notificacao/convites/pendentes/');
          if (convitesResponse.data.length === 0) {
            toast.error('Você precisa aceitar um convite para acessar os módulos. Verifique suas notificações.');
          } else {
            toast.info('Você tem convites pendentes. Por favor, aceite um convite para acessar os módulos.');
          }
          return;
        }

        // Pega a primeira empresa
        const empresa = response.data[0];

        // Se não tem vínculo ativo, verifica se tem convite pendente
        if (!empresa || empresa.status !== 'accepted') {
          const convitesResponse = await api.get('/convite_notificacao/convites/pendentes/');
          if (convitesResponse.data.length === 0) {
            toast.error('Você precisa aceitar um convite para acessar os módulos. Verifique suas notificações.');
          } else {
            toast.info('Você tem convites pendentes. Por favor, aceite um convite para acessar os módulos.');
          }
          return;
        }

        // Se tem vínculo ativo, verifica se tem permissão
        if (!userPermissions[modulo]) {
          toast.error(`Você não tem permissão para acessar o módulo ${modulo === 'financeiro' ? 'Financeiro' : 'Marketing'}. Entre em contato com o administrador da empresa.`);
          return;
        }

        // Se tem vínculo e permissão, navega para o módulo
        if (modulo === 'marketing') {
          navigate('/marketing/google/preencher-semana');
        } else if (modulo === 'financeiro') {
          navigate('/financeiro');
        }
      } catch (error) {
        // Se der erro, verifica se tem convite pendente
        const convitesResponse = await api.get('/convite_notificacao/convites/pendentes/');
        if (convitesResponse.data.length === 0) {
          toast.error('Você precisa aceitar um convite para acessar os módulos. Verifique suas notificações.');
        } else {
          toast.info('Você tem convites pendentes. Por favor, aceite um convite para acessar os módulos.');
        }
      }
    } catch (error) {
      console.error('Erro ao navegar para o módulo:', error);
      toast.error('Erro ao acessar o módulo. Por favor, tente novamente.');
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className="header">
      {/* Seção esquerda: Título ou Logo */}
      <div className="header-left">
        {["/home", "/perfil", "/configuracoes/empresas-pf", "/configuracoes/empresas", "/configuracoes/usuarios"].includes(location.pathname) ? (
          <img src={logo} alt="Logo" className="header-logo" />
        ) : (
          <h1>Main Dashboard</h1>
        )}
      </div>

      {/* Seção central: Navegação */}
      <div className="header-center">
        <nav className="header-nav">
          <button 
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => navigate('/home')}
          >
            <FiHome className="nav-icon" />
            Home
          </button>
          <button 
            className={`nav-link ${activeSection === "financeiro" ? "active" : ""}`}
            onClick={() => handleModuleClick('financeiro')}
          >
            <FiDollarSign className="nav-icon" />
            Financeiro
          </button>
          <button 
            className={`nav-link ${activeSection === "marketing" ? "active" : ""}`}
            onClick={() => handleModuleClick('marketing')}
          >
            <FiTrendingUp className="nav-icon" />
            Marketing
          </button>
        </nav>
      </div>

      {/* Seção direita: Busca, ícones e avatar com dropdown */}
      <div className="header-right">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <div className="action-icons">
          <ConviteNotificacao />
          <button className="icon-button">
            <FiClock />
          </button>
          <button className="icon-button">
            <FiMoon />
          </button>
        </div>

        <div className="profile-container">
          <div 
            className="profile-section"
            onClick={toggleProfileMenu}
            style={{ cursor: 'pointer' }}
          >
            {fotoPerfil ? (
              <img src={fotoPerfil} alt="Foto do perfil" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>

          <ProfileDropdown 
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            fotoPerfil={fotoPerfil}
          />
        </div>
      </div>
    </header>
  );
};

// Função para disparar o evento de atualização de permissões
export const notificarAtualizacaoPermissoes = () => {
  window.dispatchEvent(new Event(PERMISSOES_ATUALIZADAS));
};

export default Header;
