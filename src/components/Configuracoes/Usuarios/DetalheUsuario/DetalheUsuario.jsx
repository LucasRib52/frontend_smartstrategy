import React, { useState } from 'react';
import './DetalheUsuario.css';
import PermissoesForm from '../permissoes/PermissoesForm';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiX, FiEdit2 } from 'react-icons/fi';

/**
 * Componente para exibir e gerenciar detalhes do usuário
 */
export default function DetalheUsuario({ usuario, onFechar, onAtualizar }) {
  const [showPermissoes, setShowPermissoes] = useState(false);

  if (!usuario) return null;

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            <FiUser className="header-icon" />
            Detalhes do Usuário
          </h2>
          <button className="close-button" onClick={onFechar}>
            <FiX />
          </button>
        </div>

        <div className="detalhe-content">
          <div className="detalhe-avatar">
            {usuario.user_avatar ? (
              <img src={usuario.user_avatar} alt={usuario.user_name} />
            ) : (
              <div className="detalhe-iniciais">
                {getInitials(usuario.user_name)}
              </div>
            )}
          </div>

          <div className="detalhe-info">
            <div className="info-group">
              <label>
                <FiUser />
                Nome
              </label>
              <span>{usuario.user_name || 'Não definido'}</span>
            </div>

            <div className="info-group">
              <label>
                <FiMail />
                E-mail
              </label>
              <span>{usuario.user_email || 'Não definido'}</span>
            </div>

            {usuario.phone && (
              <div className="info-group">
                <label>
                  <FiPhone />
                  Telefone
                </label>
                <span>{usuario.phone}</span>
              </div>
            )}

            <div className="info-group">
              <label>
                <FiBriefcase />
                Cargo
              </label>
              <span>{usuario.position || 'Não definido'}</span>
            </div>

            <div className="info-group">
              <label>
                <FiLock />
                Status
              </label>
              <div className={`status-badge ${usuario.status === 'accepted' ? 'active' : 'inactive'}`}>
                {usuario.status === 'accepted' ? 'Ativo' : 'Inativo'}
              </div>
            </div>
          </div>

          <div className="detalhe-actions">
            <button 
              className="btn-permissoes"
              onClick={() => setShowPermissoes(true)}
            >
              <FiEdit2 />
              Gerenciar Permissões
            </button>
          </div>
        </div>

        {showPermissoes && (
          <PermissoesForm
            usuario={usuario}
            onClose={() => setShowPermissoes(false)}
            onSave={() => {
              onAtualizar && onAtualizar();
              setShowPermissoes(false);
            }}
          />
        )}
      </div>
    </div>
  );
} 