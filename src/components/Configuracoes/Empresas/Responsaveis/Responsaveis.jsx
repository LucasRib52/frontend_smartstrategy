import React, { useState, useEffect } from 'react';
import { empresasService } from '../../../../services/empresasService';
import './Responsaveis.css';

/**
 * Aba Responsáveis do cadastro de empresa
 * Formulário visual conforme layout da imagem enviada.
 */
export default function Responsaveis({ empresaId }) {
  // Estados locais para os campos do formulário
  const [form, setForm] = useState({
    adminId: '',
    financeiroId: '',
    emails: [],
    novoEmail: '',
    celular: '',
  });

  // Estado para controle de loading
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Estado para lista de usuários
  const [usuarios, setUsuarios] = useState([]);

  // Estado para lista de responsáveis existentes
  const [responsaveisExistentes, setResponsaveisExistentes] = useState([]);

  // Carregar dados ao montar o componente
  useEffect(() => {
    if (empresaId) {
      carregarDados();
    }
  }, [empresaId]);

  // Função para carregar dados
  async function carregarDados() {
    try {
      setLoading(true);
      setMensagem({ tipo: '', texto: '' });
      
      // Carregar responsáveis
      const responsaveis = await empresasService.responsaveis.getAll(empresaId);
      setResponsaveisExistentes(responsaveis);
      
      // Encontrar admin e financeiro
      const admin = responsaveis.find(r => r.tipo === 'admin');
      const financeiro = responsaveis.find(r => r.tipo === 'financeiro');
      
      setForm(prev => ({
        ...prev,
        adminId: admin?.usuario?.id || '',
        financeiroId: financeiro?.usuario?.id || '',
        emails: financeiro?.emails_financeiro || [],
        celular: financeiro?.celular_financeiro || '',
      }));

      // Carregar lista de usuários (isso deve vir de um serviço de usuários)
      // Por enquanto, usando dados mockados
      setUsuarios([
        { 
          id: 1, 
          nome: 'Dr. Lucas Almeida', 
          email: 'lucas.almeida@vetclinic.com.br', 
          userType: 'socio',
          cargo: 'Diretor Clínico'
        }
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Erro ao carregar dados dos responsáveis. Por favor, tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  }

  // Função para adicionar e-mail
  function adicionarEmail() {
    const email = form.novoEmail.trim();
    if (email && !form.emails.includes(email)) {
      setForm(prev => ({
        ...prev,
        emails: [...prev.emails, email],
        novoEmail: '',
      }));
    }
  }

  // Função para remover e-mail
  function removerEmail(email) {
    setForm(prev => ({
      ...prev,
      emails: prev.emails.filter(e => e !== email),
    }));
  }

  // Função para salvar dados
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setMensagem({ tipo: '', texto: '' });

      // Validar campos obrigatórios
      if (!form.adminId) {
        throw new Error('Selecione um administrador');
      }

      if (!form.financeiroId) {
        throw new Error('Selecione um responsável financeiro');
      }

      if (form.emails.length === 0) {
        throw new Error('Adicione pelo menos um email para o responsável financeiro');
      }

      if (!form.celular) {
        throw new Error('Informe o celular do responsável financeiro');
      }

      // Verificar se já existe um admin
      const adminExistente = responsaveisExistentes.find(r => r.tipo === 'admin');
      if (adminExistente) {
        // Atualizar admin existente
        await empresasService.responsaveis.update(empresaId, adminExistente.id, {
          usuario_id: parseInt(form.adminId),
          tipo: 'admin'
        });
      } else {
        // Criar novo admin
        await empresasService.responsaveis.add(empresaId, {
          usuario_id: parseInt(form.adminId),
          tipo: 'admin'
        });
      }

      // Verificar se já existe um financeiro
      const financeiroExistente = responsaveisExistentes.find(r => r.tipo === 'financeiro');
      if (financeiroExistente) {
        // Atualizar financeiro existente
        await empresasService.responsaveis.update(empresaId, financeiroExistente.id, {
          usuario_id: parseInt(form.financeiroId),
          tipo: 'financeiro',
          emails_financeiro: form.emails,
          celular_financeiro: form.celular
        });
      } else {
        // Criar novo financeiro
        await empresasService.responsaveis.add(empresaId, {
          usuario_id: parseInt(form.financeiroId),
          tipo: 'financeiro',
          emails_financeiro: form.emails,
          celular_financeiro: form.celular
        });
      }

      // Recarregar dados após salvar
      await carregarDados();

      // Mostrar mensagem de sucesso
      setMensagem({ 
        tipo: 'sucesso', 
        texto: '✅ Responsáveis configurados com sucesso! As alterações foram salvas.' 
      });

      // Manter a mensagem por 3 segundos
      setTimeout(() => {
        setMensagem({ tipo: '', texto: '' });
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar responsáveis:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.detail || error.message || 'Erro ao salvar responsáveis. Por favor, tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading-message">Carregando responsáveis...</div>;
  }

  return (
    <div className="empresa-responsaveis-container">
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`} role="alert">
          {mensagem.texto}
        </div>
      )}
      
      <form className="empresa-responsaveis-form" onSubmit={handleSubmit}>
        {/* Administrador do sistema */}
        <div className="responsavel-section">
          <h3 className="responsavel-titulo">Administrador do sistema</h3>
          <div className="form-group">
            <label htmlFor="admin-select">Sócio administrador*</label>
            <select
              id="admin-select"
              className="select-usuario-admin"
              value={form.adminId}
              onChange={e => setForm(prev => ({ ...prev, adminId: e.target.value }))}
              required
              disabled={loading}
            >
              <option value="" disabled>Selecione o sócio administrador</option>
              {usuarios.filter(u => u.userType === 'socio').map(u => (
                <option key={u.id} value={u.id} className="option-socio">
                  {u.nome} - {u.cargo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsável financeiro */}
        <div className="responsavel-section">
          <h3 className="responsavel-titulo">Responsável financeiro</h3>
          <div className="form-group">
            <label htmlFor="usuario-financeiro">Usuário*</label>
            <select
              id="usuario-financeiro"
              className="select-usuario-financeiro"
              value={form.financeiroId}
              onChange={e => setForm(prev => ({ ...prev, financeiroId: e.target.value }))}
              required
              disabled={loading}
            >
              <option value="" disabled>Selecione o responsável financeiro</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id} className={u.userType === 'socio' ? 'option-socio' : ''}>
                  {u.nome} - {u.cargo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>E-mails para recebimento de boleto e nota fiscal*</label>
            <div className="emails-list">
              {form.emails.map(email => (
                <span key={email} className="email-chip">
                  {email}
                  <button 
                    type="button" 
                    className="remover-email" 
                    onClick={() => removerEmail(email)} 
                    title="Remover"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="email"
                value={form.novoEmail}
                onChange={e => setForm(prev => ({ ...prev, novoEmail: e.target.value }))}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    adicionarEmail();
                  }
                }}
                placeholder="adicionar"
                className="input-email"
                disabled={loading}
              />
              <button 
                type="button" 
                className="adicionar-email" 
                onClick={adicionarEmail}
                disabled={loading}
              >
                adicionar
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="celular">Celular para contato financeiro*</label>
            <input
              id="celular"
              value={form.celular}
              onChange={e => setForm(prev => ({ ...prev, celular: e.target.value }))}
              placeholder="(00) 00000-0000"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Botão de salvar */}
        <div className="responsaveis-actions">
          <button type="submit" className="btn-salvar" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
} 