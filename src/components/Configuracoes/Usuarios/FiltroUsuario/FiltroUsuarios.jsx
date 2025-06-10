import React, { useState } from 'react';
import './FiltroUsuarios.css';

/**
 * Filtro de usuários simplificado: Nome, E-mail e Cargo
 */
export default function FiltroUsuarios({ aberto, onFechar, onAplicar }) {
  // Estado dos campos do filtro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');

  // Limpa todos os campos do filtro
  const limparFiltro = () => {
    setNome('');
    setEmail('');
    setPosition('');
  };

  // Aplica o filtro
  const aplicarFiltro = (e) => {
    e.preventDefault();
    onAplicar && onAplicar({ nome, email, position });
    onFechar && onFechar();
  };

  if (!aberto) return null;

  return (
    <div className="filtro-modal-bg">
      <div className="filtro-modal">
        {/* Cabeçalho do filtro */}
        <div className="filtro-header">
          <button className="filtro-voltar" onClick={onFechar}>{'<'}</button>
          <h2>Filtrar Usuários</h2>
        </div>
        {/* Formulário de filtros */}
        <form className="filtro-form" onSubmit={aplicarFiltro}>
          <div className="filtro-label">Nome</div>
          <input type="text" placeholder="Digite o nome" value={nome} onChange={e => setNome(e.target.value)} />

          <div className="filtro-label">E-mail</div>
          <input type="text" placeholder="Digite o e-mail" value={email} onChange={e => setEmail(e.target.value)} />

          <div className="filtro-label">Cargo</div>
          <input type="text" placeholder="Digite o cargo" value={position} onChange={e => setPosition(e.target.value)} />

          {/* Botões de ação */}
          <div className="filtro-botoes">
            <button type="submit" className="filtro-aplicar">Aplicar filtro</button>
            <button type="button" className="filtro-limpar" onClick={limparFiltro}>Limpar filtro</button>
          </div>
        </form>
      </div>
    </div>
  );
} 