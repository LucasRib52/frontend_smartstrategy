import React, { useState, useEffect, useRef } from 'react';
import './PerfilUsuario.css';
import api from '../../services/api';

const PerfilUsuario = () => {
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [email, setEmail] = useState('');
  const [emailOriginal, setEmailOriginal] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // 'email' | 'senha' | null
  const [novoEmail, setNovoEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [userType, setUserType] = useState('PF');
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNomeCompleto, setNovoNomeCompleto] = useState('');
  const modalRef = useRef();

  useEffect(() => {
    carregarPerfil();
  }, []);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  const carregarPerfil = async () => {
    try {
      const response = await api.get('/perfil/');
      setEmail(response.data.email);
      setEmailOriginal(response.data.email);
      setNomeCompleto(response.data.nome_completo);
      setNovoNomeCompleto(response.data.nome_completo);
      setUserType(response.data.user_type || 'PF');
      if (response.data.foto) {
        setFoto(response.data.foto);
        setFotoPreview(response.data.foto);
      }
    } catch (error) {
      setMensagem('Erro ao carregar perfil');
      setTipoMensagem('erro');
    }
  };

  const handleFotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFoto(file);
      setFotoPreview(URL.createObjectURL(file));
      setLoading(true);
      setMensagem("");
      setTipoMensagem("");
      try {
        const formData = new FormData();
        formData.append('foto', file);
        const response = await api.post('/perfil/upload-foto/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFotoPreview(response.data.foto_url);
        setMensagem('Foto atualizada com sucesso!');
        setTipoMensagem('sucesso');
      } catch (error) {
        setMensagem('Erro ao atualizar foto');
        setTipoMensagem('erro');
      }
      setLoading(false);
    }
  };

  // Modal Email
  const abrirModalEmail = () => {
    setNovoEmail(email);
    setSenhaAtual('');
    setMensagem('');
    setTipoMensagem('');
    setModal('email');
  };
  const salvarNovoEmail = async (e) => {
    e.preventDefault();
    setMensagem('');
    setTipoMensagem('');
    setLoading(true);
    if (!novoEmail || !senhaAtual) {
      setMensagem('Preencha todos os campos');
      setTipoMensagem('erro');
      setLoading(false);
      return;
    }
    try {
      await api.put('/perfil/atualizar-email/', { email: novoEmail, senha: senhaAtual });
      setEmail(novoEmail);
      setEmailOriginal(novoEmail);
      setModal(null);
      setMensagem('Email atualizado com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      let msg = 'Erro ao atualizar email';
      if (error.response?.data?.error) msg = error.response.data.error;
      setMensagem(msg);
      setTipoMensagem('erro');
    }
    setLoading(false);
  };

  // Modal Senha
  const abrirModalSenha = () => {
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setMensagem('');
    setTipoMensagem('');
    setModal('senha');
  };
  const salvarNovaSenha = async (e) => {
    e.preventDefault();
    setMensagem('');
    setTipoMensagem('');
    setLoading(true);
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem('Preencha todos os campos');
      setTipoMensagem('erro');
      setLoading(false);
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem('Nova senha e confirmação não coincidem');
      setTipoMensagem('erro');
      setLoading(false);
      return;
    }
    try {
      await api.put('/perfil/atualizar-senha/', { senha_atual: senhaAtual, nova_senha: novaSenha });
      setModal(null);
      setMensagem('Senha atualizada com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      let msg = 'Erro ao atualizar senha';
      if (error.response?.data?.error) msg = error.response.data.error;
      setMensagem(msg);
      setTipoMensagem('erro');
    }
    setLoading(false);
  };

  const salvarNovoNome = async () => {
    setMensagem('');
    setTipoMensagem('');
    setLoading(true);
    if (!novoNomeCompleto) {
      setMensagem('Preencha o nome');
      setTipoMensagem('erro');
      setLoading(false);
      return;
    }
    try {
      const resp = await api.put('/perfil/atualizar-nome/', { nome_completo: novoNomeCompleto });
      setNomeCompleto(resp.data.nome_completo || novoNomeCompleto);
      setEditandoNome(false);
      setMensagem('Nome atualizado com sucesso!');
      setTipoMensagem('sucesso');
    } catch (error) {
      let msg = 'Erro ao atualizar nome';
      if (error.response?.data?.error) msg = error.response.data.error;
      else if (error.message) msg = error.message;
      setMensagem(msg);
      setTipoMensagem('erro');
    }
    setLoading(false);
  };

  // Fechar modal ao clicar fora
  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModal(null);
    }
  };

  return (
    <div className="perfil-usuario-novo-container">
      <form className="perfil-form-novo" onSubmit={handleFotoChange}>
        <h2 className="perfil-titulo">Meu Perfil</h2>
        <div className="perfil-foto-upload">
          <div className="foto-preview-novo">
            {fotoPreview ? (
              <img src={fotoPreview} alt="Foto do perfil" className="foto-perfil-novo" />
            ) : (
              <div className="foto-placeholder-novo">Foto do perfil</div>
            )}
          </div>
          <label className="btn-upload-foto">
            Alterar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
          </label>
        </div>
        <div className="perfil-campos">
          <label>{userType === 'PJ' ? 'Nome do Responsável' : 'Nome Completo'}</label>
          <div className="perfil-dado-visual">
            {editandoNome ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={novoNomeCompleto}
                  onChange={e => setNovoNomeCompleto(e.target.value)}
                  className="input-novo"
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-salvar-novo"
                  disabled={loading}
                  onClick={salvarNovoNome}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={() => { setEditandoNome(false); setNovoNomeCompleto(nomeCompleto); }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <span>{nomeCompleto}</span>
                <button type="button" className="btn-editar" onClick={() => setEditandoNome(true)}>
                  Editar
                </button>
              </>
            )}
          </div>
        </div>
        <div className="perfil-campos">
          <label>Email</label>
          <div className="perfil-dado-visual">
            <span>{email}</span>
            <button type="button" className="btn-editar" onClick={abrirModalEmail}>
              Atualizar Email
            </button>
          </div>
        </div>
        <div className="perfil-campos">
          <label>Senha</label>
          <div className="perfil-dado-visual">
            <span>********</span>
            <button type="button" className="btn-editar" onClick={abrirModalSenha}>
              Atualizar Senha
            </button>
          </div>
        </div>
        {mensagem && !modal && (
          <div className={`mensagem-novo ${tipoMensagem}`}>{mensagem}</div>
        )}
      </form>
      {/* Modal Email */}
      {modal === 'email' && (
        <div className="modal-bg" onClick={handleModalClick}>
          <div className="modal-conteudo" ref={modalRef}>
            <h3>Atualizar Email</h3>
            <form onSubmit={salvarNovoEmail} className="modal-form">
              <input
                type="email"
                value={novoEmail}
                onChange={e => setNovoEmail(e.target.value)}
                className="input-novo"
                placeholder="Novo email"
                autoFocus
              />
              <input
                type="password"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
                className="input-novo"
                placeholder="Digite sua senha atual para confirmar"
                autoComplete="current-password"
              />
              {mensagem && (
                <div className={`mensagem-novo ${tipoMensagem}`}>{mensagem}</div>
              )}
              <div className="botoes-modal">
                <button type="button" className="btn-cancelar" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn-salvar-novo" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Senha */}
      {modal === 'senha' && (
        <div className="modal-bg" onClick={handleModalClick}>
          <div className="modal-conteudo" ref={modalRef}>
            <h3>Atualizar Senha</h3>
            <form onSubmit={salvarNovaSenha}>
              <input
                type="password"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
                className="input-novo"
                placeholder="Senha atual"
                autoFocus
                autoComplete="current-password"
              />
              <input
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="input-novo"
                placeholder="Nova senha"
                autoComplete="new-password"
              />
              <input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="input-novo"
                placeholder="Confirmar nova senha"
                autoComplete="new-password"
              />
              {mensagem && (
                <div className={`mensagem-novo ${tipoMensagem}`}>{mensagem}</div>
              )}
              <div className="botoes-modal">
                <button type="button" className="btn-cancelar" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn-salvar-novo" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilUsuario;
