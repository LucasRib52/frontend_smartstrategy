import React, { useState, useEffect } from 'react';
import './Usuarios.css';
import FiltroUsuarios from './FiltroUsuario/FiltroUsuarios';
import AdicionarUsuario from './AdicionarUsuario/AdicionarUsuario';
import DetalheUsuario from './DetalheUsuario/DetalheUsuario';
import { usuariosService } from '../../../services/usuarios/usuariosService';

export default function UsuariosPainel() {
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [adicionarAberto, setAdicionarAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [indiceSelecionado, setIndiceSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [filtrosAtivos, setFiltrosAtivos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Limite do plano (pode ser dinâmico no futuro)
  const LIMITE_PLANO = 10;

  // Cálculos dinâmicos do painel de resumo
  const totalCadastrados = usuarios.length;
  const ativosComAcesso = usuarios.filter(u => u.status === 'accepted').length;
  const ativosSemAcesso = usuarios.filter(u => u.status !== 'accepted' && u.status !== 'inactive' && u.status !== 'rejected').length;
  const arquivados = usuarios.filter(u => u.status === 'inactive' || u.status === 'rejected').length;
  const restantes = Math.max(LIMITE_PLANO - ativosComAcesso, 0);

  const resumo = [
    { cor: 'azul', valor: restantes, texto: 'Usuário restante para cadastro' },
    { cor: 'roxo', valor: LIMITE_PLANO, texto: 'Limite do seu plano atual' },
    { cor: 'verde', valor: ativosComAcesso, texto: 'Ativos com acesso ao sistema' },
    { cor: 'laranja', valor: ativosSemAcesso, texto: 'Ativos sem acesso ao sistema' },
    { cor: 'cinza', valor: arquivados, texto: 'Arquivados' },
  ];

  function getInitials(nome) {
    return nome.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  }

  // Carregar usuários
  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuariosService.listarUsuarios();
      // Garantir que data seja um array
      setUsuarios(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error('Erro:', err);
      setUsuarios([]); // Garantir que usuarios seja um array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUsuariosFiltrados(usuarios);
  }, [usuarios]);

  const aplicarFiltro = (filtros) => {
    let filtrados = usuarios;
    if (filtros) {
      if (filtros.email) {
        filtrados = filtrados.filter(u => (u.user_email || '').toLowerCase().includes(filtros.email.toLowerCase()));
      }
      if (filtros.position) {
        filtrados = filtrados.filter(u => (u.position || '').toLowerCase().includes(filtros.position.toLowerCase()));
      }
      if (filtros.nome) {
        filtrados = filtrados.filter(u => (u.user_name || '').toLowerCase().includes(filtros.nome.toLowerCase()));
      }
    }
    setUsuariosFiltrados(filtrados);
    setFiltrosAtivos(filtros);
    setFiltroAberto(false);
  };

  const handleAbrirDetalhe = (usuario, idx) => {
    setUsuarioSelecionado(usuario);
    setIndiceSelecionado(idx);
  };

  const handleFecharDetalhe = () => {
    setUsuarioSelecionado(null);
    setIndiceSelecionado(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      await usuariosService.toggleStatus(id);
      await carregarUsuarios(); // Recarrega a lista
    } catch (err) {
      setError('Erro ao alterar status');
      console.error('Erro:', err);
    }
  };

  // Checagem de tipo de empresa
  let isPJ = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    isPJ = user?.user?.user_type === 'PJ';
  } catch {}
  if (!isPJ) {
    return <div style={{padding: 32, textAlign: 'center', color: '#1976d2', fontWeight: 600, fontSize: '1.2rem'}}>A gestão de usuários só está disponível para empresas (PJ).</div>;
  }

  if (loading) {
    return <div className="usuarios-loading">Carregando...</div>;
  }

  if (error) {
    return <div className="usuarios-error">{error}</div>;
  }

  return (
    <div className="usuarios-painel-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 className="usuarios-painel-title">Usuários</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            className="btn-add-usuario"
            title="Adicionar usuário"
            onClick={() => setAdicionarAberto(true)}
          >
            +
          </button>
          <button
            className="btn-next"
            style={{ minWidth: 44, borderRadius: '50%', padding: 0, width: 44, height: 44, fontSize: 28, lineHeight: 0 }}
            title="Filtrar usuários"
            onClick={() => setFiltroAberto(true)}
          >
            &#128269;
          </button>
        </div>
      </div>
      <div className="usuarios-resumo">
        {resumo.map((card, i) => (
          <div key={i} className={`usuarios-card usuarios-card-${card.cor}`}> 
            <div className="usuarios-card-valor">{card.valor}</div>
            <div className="usuarios-card-texto">{card.texto} {card.link && <a href="#">{card.link}</a>}</div>
          </div>
        ))}
      </div>
      <div className="usuarios-tabela-wrapper">
        {filtrosAtivos && (usuariosFiltrados.length > 0 ? (
          <div style={{padding: '8px 24px', color: '#1976d2', fontWeight: 600, fontSize: '1rem'}}>
            Filtro aplicado: {Object.entries(filtrosAtivos).filter(([k,v])=>v).map(([k,v])=>`${k}: ${v}`).join(' | ')}
          </div>
        ) : (
          <div style={{padding: '8px 24px', color: '#d32f2f', fontWeight: 600, fontSize: '1rem'}}>
            Nenhum usuário encontrado para o filtro aplicado.
          </div>
        ))}
        <table className="usuarios-tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados && usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u, i) => (
                <tr
                  key={u.id}
                  className={indiceSelecionado === i ? 'selecionado' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleAbrirDetalhe(u, i)}
                >
                  <td>
                    <span className="usuarios-avatar">
                      {u.user_avatar ? (
                        <img src={u.user_avatar} alt={u.user_name || ''} />
                      ) : (
                        <span className="usuarios-iniciais">{getInitials(u.user_name || '')}</span>
                      )}
                    </span>
                    <span className="usuarios-nome">{u.user_name || 'Sem nome'}</span>
                  </td>
                  <td>{u.user_email || '-'}</td>
                  <td>{u.position || 'Sem cargo'}</td>
                  <td>
                    <span className={`usuarios-acesso ${u.status === 'accepted' ? 'liberado' : 'sem-acesso'}`}>
                      {u.status === 'accepted' ? 'Acesso liberado' : 'Sem acesso'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(u.id);
                      }}
                      className={`btn-toggle-status ${u.status === 'accepted' ? 'active' : ''}`}
                    >
                      {u.status === 'accepted' ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AdicionarUsuario 
        aberto={adicionarAberto} 
        onFechar={() => setAdicionarAberto(false)}
        onSucesso={carregarUsuarios}
      />
      <FiltroUsuarios
        aberto={filtroAberto}
        onFechar={() => setFiltroAberto(false)}
        onAplicar={aplicarFiltro}
      />
      <DetalheUsuario 
        usuario={usuarioSelecionado} 
        onFechar={handleFecharDetalhe}
        onAtualizar={carregarUsuarios}
      />
    </div>
  );
} 