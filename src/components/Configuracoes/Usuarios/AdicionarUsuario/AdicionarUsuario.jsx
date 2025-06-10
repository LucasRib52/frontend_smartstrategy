import React, { useState, useEffect } from 'react';
import './AdicionarUsuario.css';
import { usuariosService } from '../../../../services/usuarios/usuariosService';
import { permissoesService } from '../../../../services/usuarios/permissoesService';
import { FiUser, FiMail, FiBriefcase, FiLock, FiX, FiSave, FiAlertCircle, FiLoader, FiCheck } from 'react-icons/fi';

/**
 * Wizard de cadastro de usuário
 * Etapas: E-mail -> Cargo -> Perfil de acesso
 */
export default function AdicionarUsuario({ aberto, onFechar, onSucesso }) {
  const [formData, setFormData] = useState({
    email: '',
    position: '',
    permissions: {
      modulos: {}
    }
  });
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarModulos = async () => {
      try {
        const response = await permissoesService.listarModulos();
        const modulosData = Array.isArray(response) ? response : 
                          response.results ? response.results : 
                          [];
        
        setModulos(modulosData);
        
        const permissoesIniciais = {};
        modulosData.forEach(modulo => {
          permissoesIniciais[modulo.codigo] = false;
        });
        
        setFormData(prev => ({
          ...prev,
          permissions: {
            modulos: permissoesIniciais
          }
        }));
      } catch (err) {
        console.error('Erro ao carregar módulos:', err);
        setError('Erro ao carregar módulos disponíveis');
        setModulos([]);
      }
    };

    if (aberto) {
      carregarModulos();
    }
  }, [aberto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleModulo = (codigo) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        modulos: {
          ...prev.permissions.modulos,
          [codigo]: !prev.permissions.modulos[codigo]
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await usuariosService.adicionarUsuario(formData);
      onSucesso();
      onFechar();
    } catch (err) {
      let msg = 'Erro ao adicionar usuário';
      if (err.response && err.response.data) {
        if (err.response.data.email) {
          msg = err.response.data.email[0];
        } else if (Array.isArray(err.response.data)) {
          msg = err.response.data.join(' ');
        } else if (typeof err.response.data === 'object') {
          msg = Object.values(err.response.data).flat().join(' ');
        } else if (typeof err.response.data === 'string') {
          msg = err.response.data;
        }
      }
      setError(msg);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            <FiUser className="header-icon" />
            Adicionar Usuário
          </h2>
          <button className="close-button" onClick={onFechar}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <FiMail />
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite o e-mail do usuário"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">
              <FiBriefcase />
              Cargo
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Digite o cargo do usuário"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FiLock />
              Módulos de Acesso
            </label>
            {loading ? (
              <div className="loading-message">
                <FiLoader className="loading-icon" />
                <span>Carregando módulos...</span>
              </div>
            ) : error ? (
              <div className="error-message">
                <FiAlertCircle />
                {error}
              </div>
            ) : modulos.length === 0 ? (
              <div className="error-message">
                <FiAlertCircle />
                Nenhum módulo disponível
              </div>
            ) : (
              <div className="modulos-grid">
                {modulos.map(modulo => (
                  <div key={modulo.codigo} className="modulo-item">
                    <label className="modulo-label">
                      <input
                        type="checkbox"
                        checked={formData.permissions.modulos[modulo.codigo] || false}
                        onChange={() => handleToggleModulo(modulo.codigo)}
                      />
                      <div className="modulo-info">
                        <span className="modulo-nome">
                          <FiCheck />
                          {modulo.nome}
                        </span>
                        {modulo.descricao && (
                          <span className="modulo-descricao">{modulo.descricao}</span>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message">
              <FiAlertCircle />
              {error}
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onFechar}>
              <FiX />
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="loading-icon" />
                  Salvando...
                </>
              ) : (
                <>
                  <FiSave />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 