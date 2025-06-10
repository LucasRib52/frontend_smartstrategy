import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiChevronRight, FiUsers } from 'react-icons/fi';
import { FaBuilding } from 'react-icons/fa';
import './ProfileDropdown.css';
import { authService } from '../../../services/auth/authService';

/**
 * Componente ProfileDropdown - Menu dropdown do perfil do usuário
 * Exibe informações do usuário, links de navegação e opções de configuração/logout.
 *
 * Props:
 * - isOpen: booleano que controla a exibição do dropdown
 * - onClose: função chamada ao fechar o dropdown
 * - fotoPerfil: string opcional que representa a URL da foto do perfil
 */
const ProfileDropdown = ({ isOpen, onClose, fotoPerfil }) => {
  // Estado para controlar loading do logout
  const [isLoading, setIsLoading] = useState(false);
  // Estado para armazenar dados do usuário logado
  const [user, setUser] = useState(null);
  // Estado para exibir ou ocultar submenu de configurações
  const [showConfigSubmenu, setShowConfigSubmenu] = useState(false);
  const navigate = useNavigate();

  // Busca usuário atual ao abrir o dropdown
  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const profileData = await authService.getProfile();
          setUser(profileData);
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      };
      fetchUserData();
    }
  }, [isOpen]);

  // Função para realizar logout
  const handleLogout = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      onClose?.();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      window.location.href = '/login';
    }
  };

  const handlePerfilClick = () => {
    navigate('/perfil');
    onClose();
  };

  // Não renderiza nada se o dropdown estiver fechado
  if (!isOpen) return null;

  // Função para obter o nome completo do usuário
  const getNomeCompleto = () => {
    if (!user) return 'Usuário';
    
    if (user.profile) {
      if (user.user.user_type === 'PF') {
        return user.profile.name || 'Usuário';
      } else {
        return user.profile.responsible_name || user.profile.company_name || 'Usuário';
      }
    }
    
    return 'Usuário';
  };

  return (
    <div className="profile-dropdown" role="menu" aria-label="Menu do perfil">
      {/* Cabeçalho com avatar e informações do usuário */}
      <div className="profile-header">
        {fotoPerfil ? (
          <img 
            src={fotoPerfil} 
            alt="Foto do perfil" 
            className="profile-avatar"
          />
        ) : (
          <img 
            src={user?.profile?.foto || '/default-avatar.png'} 
            alt="Avatar do usuário" 
            className="profile-avatar"
          />
        )}
        <div className="profile-info">
          <h4 className="profile-name">{getNomeCompleto()}</h4>
          <p className="profile-email">{user?.user?.email}</p>
        </div>
      </div>

      {/* Item: Meu Perfil */}
      <button
        type="button"
        className="profile-menu-item"
        onClick={handlePerfilClick}
        tabIndex={0}
        aria-label="Ir para meu perfil"
      >
        <FiUser size={20} className="menu-icon" />
        Meu Perfil
      </button>

      {/* Item: Configurações (abre submenu) */}
      <button
        type="button"
        className="profile-menu-item config-menu-item"
        onClick={() => setShowConfigSubmenu(!showConfigSubmenu)}
        aria-expanded={showConfigSubmenu}
        aria-controls="config-submenu"
        tabIndex={0}
      >
        <FiSettings size={20} className="menu-icon" />
        Configurações
        <FiChevronRight 
          size={16} 
          className={`submenu-arrow ${showConfigSubmenu ? 'rotated' : ''}`} 
        />
      </button>

      {/* Submenu de configurações */}
      {showConfigSubmenu && (
        <div className="config-submenu" id="config-submenu">
          {/* Subitem: Empresas */}
          <button
            type="button"
            className="profile-menu-item submenu-item"
            onClick={() => {
              if (user?.user?.user_type === 'PF') {
                navigate('/configuracoes/empresas-pf');
              } else {
                navigate('/configuracoes/empresas');
              }
              onClose();
            }}
            tabIndex={0}
            aria-label="Configurações de empresas"
          >
            <FaBuilding size={18} className="menu-icon" />
            {user?.user?.user_type === 'PF' ? 'Minhas Empresas' : 'Empresas'}
          </button>
          {/* Subitem: Usuários - só aparece se for PJ */}
          {(user?.user?.user_type === 'PJ') && (
            <button
              type="button"
              className="profile-menu-item submenu-item"
              onClick={() => {
                navigate('/configuracoes/usuarios');
                onClose();
              }}
              tabIndex={0}
              aria-label="Configurações de usuários"
            >
              <FiUsers size={18} className="menu-icon" />
              Usuários
            </button>
          )}
        </div>
      )}

      {/* Botão de logout */}
      <button 
        type="button"
        onClick={handleLogout} 
        className={`profile-menu-item logout${isLoading ? ' loading' : ''}`}
        disabled={isLoading}
        tabIndex={0}
        aria-label="Sair da conta"
      >
        <FiLogOut size={20} className={`menu-icon${isLoading ? ' spinning' : ''}`} />
        {isLoading ? 'Saindo...' : 'Sair'}
      </button>
    </div>
  );
};

export default ProfileDropdown; 