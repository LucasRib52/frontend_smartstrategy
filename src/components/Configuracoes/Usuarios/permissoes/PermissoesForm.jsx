import React, { useState, useEffect } from 'react';
import { permissoesService } from '../../../../services/usuarios/permissoesService';
import { notificarAtualizacaoPermissoes } from '../../../../components/Header/Header';
import './PermissoesForm.css';
import { FiUser, FiLock, FiSave, FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function PermissoesForm({ usuario, onClose, onSave }) {
    const [modulos, setModulos] = useState([]);
    const [permissoes, setPermissoes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarPermissoes();
    }, [usuario]);

    const carregarPermissoes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Verifica se temos um usuário válido
            if (!usuario) {
                throw new Error('Usuário não fornecido');
            }

            // O usuário é um vínculo (UserCompanyLink), então usamos o id diretamente
            if (!usuario.id) {
                throw new Error('ID do vínculo não disponível');
            }

            console.log('Carregando permissões para:', { usuario });
            const data = await permissoesService.obterModulosDisponiveis(usuario.id);
            console.log('Módulos disponíveis:', data);
            
            setModulos(data);
            
            // Inicializa as permissões com os valores atuais
            const permissoesIniciais = {};
            data.forEach(modulo => {
                permissoesIniciais[modulo.codigo] = modulo.tem_permissao;
            });
            setPermissoes(permissoesIniciais);
            
        } catch (err) {
            console.error('Erro ao carregar permissões:', err);
            setError(err.message || 'Erro ao carregar permissões');
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermissao = (codigo) => {
        setPermissoes(prev => ({
            ...prev,
            [codigo]: !prev[codigo]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await permissoesService.atualizarPermissoes(usuario.id, permissoes);
            // Notifica que as permissões foram atualizadas
            notificarAtualizacaoPermissoes();
            onSave && onSave();
            onClose();
        } catch (err) {
            setError('Erro ao salvar permissões');
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="permissoes-loading">
                <FiLoader className="loading-icon" size={24} />
                <p>Carregando permissões...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="permissoes-error">
                <FiAlertCircle size={24} />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="permissoes-form-wrapper">
            <div className="permissoes-form-header">
                <FiLock size={32} className="header-icon" />
                <h2>Permissões de Acesso</h2>
                <p className="permissoes-form-subtitle">
                    Gerencie as permissões de acesso para <strong>{usuario.user_name}</strong>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="permissoes-form">
                <div className="permissoes-modulos">
                    {modulos.map(modulo => (
                        <div key={modulo.codigo} className="permissoes-modulo">
                            <label className="permissoes-modulo-label">
                                <input
                                    type="checkbox"
                                    checked={permissoes[modulo.codigo] || false}
                                    onChange={() => handleTogglePermissao(modulo.codigo)}
                                />
                                <div className="permissoes-modulo-info">
                                    <span className="permissoes-modulo-nome">
                                        <FiUser size={18} />
                                        {modulo.nome}
                                    </span>
                                    {modulo.descricao && (
                                        <span className="permissoes-modulo-descricao">
                                            {modulo.descricao}
                                        </span>
                                    )}
                                </div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="permissoes-form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <FiX size={20} />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-save"
                        disabled={loading}
                    >
                        <FiSave size={20} />
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
} 