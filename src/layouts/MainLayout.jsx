import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import './mainLayout.css';

/**
 * Layout principal da aplicação
 * Gerencia o estado da navegação e estrutura básica do layout
 * 
 * @returns {JSX.Element} Layout estruturado com Header, Sidebar e área de conteúdo
 */
function MainLayout({ children }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('marketing');
  const [showSidebar, setShowSidebar] = useState(true);

  // Atualiza a seção ativa e visibilidade da sidebar baseado na rota atual
  useEffect(() => {
    const path = location.pathname;
    const noSidebarRoutes = [
      '/home',
      '/perfil',
      '/configuracoes/empresas-pf',
      '/configuracoes/empresas',
      '/configuracoes/usuarios'
    ];
    if (noSidebarRoutes.includes(path)) {
      setShowSidebar(false);
      setActiveSection('home');
    } else {
      setShowSidebar(true);
      if (path.includes('/marketing')) {
        setActiveSection('marketing');
      } else if (path.includes('/financeiro')) {
        setActiveSection('financeiro');
      }
    }
  }, [location]);

  return (
    <div className="layout">
      {/* Header com navegação principal */}
      <Header 
        onNavigate={setActiveSection} 
        activeSection={activeSection}
      />
      
      <div className="layout-content">
        {/* Sidebar só aparece se showSidebar for true */}
        {showSidebar && (
          <Sidebar 
            activeSection={activeSection}
          />
        )}
        
        {/* Área principal de conteúdo - ajusta a margem baseado na sidebar */}
        <main className={`main-content ${!showSidebar ? 'full-width' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout; 