import React, { useState, useEffect } from 'react';
import Geral from './Geral/Geral';
import Endereco from './Endereco/Endereco';
import Logomarca from './Logomarca/Logomarca';
import Parametros from './Parametros/Parametros';
import Responsaveis from './Responsaveis/Responsaveis';
import { FaGlobeAmericas, FaMapMarkerAlt, FaImage, FaCogs, FaUserFriends } from 'react-icons/fa';
import './Empresas.css';
import { empresasService } from '../../../services/empresasService';

// Definição das abas com ícones
const abas = [
  { label: 'Geral', key: 'geral', icon: <FaGlobeAmericas /> },
  { label: 'Endereço', key: 'endereco', icon: <FaMapMarkerAlt /> },
  { label: 'Logomarca', key: 'logomarca', icon: <FaImage /> },
  { label: 'Parâmetros', key: 'parametros', icon: <FaCogs /> },
  { label: 'Responsáveis', key: 'responsaveis', icon: <FaUserFriends /> },
];

/**
 * Componente principal de Empresas (Configurações)
 * Gerencia as abas e renderiza o conteúdo de cada uma.
 */
export default function Empresas() {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [empresaId, setEmpresaId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarUltimaEmpresa = async () => {
      try {
        setLoading(true);
        const response = await empresasService.getAll();
        const empresas = Array.isArray(response) ? response : response.results || [];
        if (empresas && empresas.length > 0) {
          const ultimaEmpresa = empresas.sort((a, b) => b.id - a.id)[0];
          setEmpresaId(ultimaEmpresa.id);
        }
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      } finally {
        setLoading(false);
      }
    };
    buscarUltimaEmpresa();
  }, []);

  if (loading) {
    return <div>Carregando dados da empresa...</div>;
  }

  return (
    <div className="empresas-config-wrapper">
      <h1 className="empresas-config-title">Dados da Empresa</h1>
      <div className="empresas-config-abas">
        {abas.map((aba) => (
          <button
            key={aba.key}
            className={`empresas-config-aba-btn${abaAtiva === aba.key ? ' ativa' : ''}`}
            onClick={() => setAbaAtiva(aba.key)}
            type="button"
          >
            <span className="aba-icon">{aba.icon}</span>
            <span>{aba.label}</span>
          </button>
        ))}
      </div>
      <div className="empresas-config-conteudo">
        {abaAtiva === 'geral' && <Geral empresaId={empresaId} />}
        {abaAtiva === 'endereco' && <Endereco empresaId={empresaId} />}
        {abaAtiva === 'logomarca' && <Logomarca empresaId={empresaId} />}
        {abaAtiva === 'parametros' && <Parametros empresaId={empresaId} />}
        {abaAtiva === 'responsaveis' && <Responsaveis empresaId={empresaId} />}
      </div>
    </div>
  );
} 