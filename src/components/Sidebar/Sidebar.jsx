import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import { FinanceiroNav } from "./navigation/FinanceiroNav";
import { MarketingNav } from "./navigation/MarketingNav";
import logo from "../../assets/images/logo.png";

/**
 * Configuração central das navegações.
 * Mapeia cada seção para seu respectivo componente de navegação.
 */
const navigationConfig = {
  financeiro: FinanceiroNav,
  marketing: MarketingNav
};

/**
 * Componente para renderizar uma seção da sidebar.
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.section - Dados da seção (título e itens).
 * @param {string} props.expandedItem - Item expandido atualmente.
 * @param {function} props.onItemClick - Função para lidar com o clique em um item.
 * @param {string} props.activePath - Caminho atual da rota.
 * @returns {JSX.Element} Seção da sidebar com título e itens de navegação.
 */
const SidebarSection = ({ section, expandedItem, onItemClick, activePath }) => {
  return (
    <div className="nav-section">
      <p className="nav-section-title">{section.title}</p>
      {section.items.map((item) => {
        const isExpanded = expandedItem === item.id;
        const isActive = item.path === activePath || 
                        (item.submenu && item.submenu.some(subItem => subItem.path === activePath));
        
        return (
          <div key={item.id}>
            <button 
              onClick={() => onItemClick(item)}
              className={`nav-item ${item.submenu ? 'has-submenu' : ''} ${isExpanded ? 'expanded' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="nav-item-content">
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </button>
            
            {/* Renderiza o submenu se existir e estiver expandido */}
            {item.submenu && item.submenu.length > 0 && isExpanded && (
              <div className="submenu">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={`submenu-item ${subItem.path === activePath ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Componente Sidebar - Menu lateral dinâmico.
 * 
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.activeSection - Seção atual ativa (dashboard, financeiro, marketing).
 * @returns {JSX.Element} Sidebar com navegação dinâmica baseada na seção ativa.
 */
function Sidebar({ activeSection }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  
  // Obtém a configuração de navegação para a seção ativa
  const content = navigationConfig[activeSection] || { sections: [] };

  const handleItemClick = (item) => {
    if (item.submenu) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
  };

  // Efeito para manter o item expandido quando a rota atual está em seu submenu
  useEffect(() => {
    if (!content.sections) return;

    const findExpandedItem = () => {
      for (const section of content.sections) {
        for (const item of section.items) {
          if (item.submenu && item.submenu.some(subItem => subItem.path === location.pathname)) {
            return item.id;
          }
        }
      }
      return null;
    };

    const expandedItemId = findExpandedItem();
    if (expandedItemId) {
      setExpandedItem(expandedItemId);
    }
  }, [location.pathname, content.sections]);

  // Se não houver conteúdo, renderiza uma sidebar vazia mas mantém a estrutura
  if (!content.sections || content.sections.length === 0) {
    return (
      <div className="sidebar closed">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Logo do Sistema" className="sidebar-logo" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="Logo do Sistema" className="sidebar-logo" />
          </div>
          <h1 className="section-title">{content.title}</h1>
        </div>

        <nav className="sidebar-nav">
          {content.sections.map((section, index) => (
            <SidebarSection 
              key={index} 
              section={section} 
              expandedItem={expandedItem}
              onItemClick={handleItemClick}
              activePath={location.pathname}
            />
          ))}
        </nav>

        <div className="help-box">
          <h3>Precisa de ajuda?</h3>
          <p>Confira nossa documentação</p>
          <button className="help-button">Documentação</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
