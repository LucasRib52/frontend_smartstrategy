import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import conviteService from '../../services/conviteService';
import './ConviteNotificacao.css';

const ConviteNotificacao = () => {
    const [convites, setConvites] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Carrega os convites pendentes
    const carregarConvites = async () => {
        try {
            const data = await conviteService.listarConvitesPendentes();
            setConvites(data);
        } catch (error) {
            console.error('Erro ao carregar convites:', error);
        }
    };

    // Carrega os convites quando o componente monta
    useEffect(() => {
        carregarConvites();
    }, []);

    // Fecha o dropdown quando clica fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Aceita um convite
    const handleAceitar = async (id) => {
        try {
            await conviteService.aceitarConvite(id);
            await carregarConvites();
            // Se não houver mais convites, fecha o dropdown
            if (convites.length === 1) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Erro ao aceitar convite:', error);
        }
    };

    // Recusa um convite
    const handleRecusar = async (id) => {
        try {
            await conviteService.recusarConvite(id);
            await carregarConvites();
            // Se não houver mais convites, fecha o dropdown
            if (convites.length === 1) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Erro ao recusar convite:', error);
        }
    };

    return (
        <div className="convite-notificacao" ref={dropdownRef}>
            <button
                className="convite-notificacao-bell"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        carregarConvites();
                    }
                }}
            >
                <FiBell size={20} />
                {convites.length > 0 && (
                    <span className="convite-notificacao-badge">
                        {convites.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="convite-notificacao-dropdown">
                    {convites.length === 0 ? (
                        <div className="convite-notificacao-empty">
                            Nenhum convite pendente
                        </div>
                    ) : (
                        <>
                            {convites.map((convite) => (
                                <div key={convite.id} className="convite-card">
                                    <div className="convite-info">
                                        <h4>{convite.empresa_nome}</h4>
                                        <p>Enviado em: {new Date(convite.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="convite-actions">
                                        <button
                                            className="botao-aceitar-convite"
                                            onClick={() => handleAceitar(convite.id)}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            className="botao-recusar-convite"
                                            onClick={() => handleRecusar(convite.id)}
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="botao-ver-todos"
                                onClick={() => navigate('/convites')}
                            >
                                Ver todos
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConviteNotificacao; 