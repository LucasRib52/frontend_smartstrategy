import React, { useState, useEffect } from 'react';
import { empresasService } from '../../../../services/empresasService';
import './Parametros.css';

/**
 * Aba Parâmetros do cadastro de empresa
 * Formulário visual conforme layout da imagem enviada.
 */
export default function Parametros({ empresaId }) {
  // Estados locais para os campos do formulário
  const [form, setForm] = useState({
    fuso: 'America/Sao_Paulo',
    idadeInfo: 'aniversario',
    arquivar: false,
    bloqueio: 'nao_bloquear',
  });

  // Estado para controle de loading
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [erros, setErros] = useState({});

  // Carregar parâmetros ao montar o componente
  useEffect(() => {
    carregarParametros();
  }, []);

  // Função para carregar parâmetros
  async function carregarParametros() {
    try {
      setLoading(true);
      const data = await empresasService.parametros.get(empresaId);
      
      if (data) {
        setForm({
          fuso: data.fuso_horario || 'America/Sao_Paulo',
          idadeInfo: data.info_idade_cliente || 'aniversario',
          arquivar: data.arquivar_ficha_automatico || false,
          bloqueio: data.bloqueio_eventos_clinicos || 'nao_bloquear',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.detail || 'Erro ao carregar parâmetros' 
      });
    } finally {
      setLoading(false);
    }
  }

  // Função para validar os dados
  function validarDados() {
    const novosErros = {};
    
    if (!form.fuso) {
      novosErros.fuso = 'Fuso horário é obrigatório';
    }
    
    if (!form.idadeInfo) {
      novosErros.idadeInfo = 'Informação sobre idade é obrigatória';
    }
    
    if (!form.bloqueio) {
      novosErros.bloqueio = 'Bloqueio de eventos é obrigatório';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  // Função para salvar dados
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validarDados()) {
      setMensagem({ 
        tipo: 'erro', 
        texto: 'Por favor, corrija os erros antes de salvar' 
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Mapear dados do formulário para o formato da API
      const data = {
        fuso_horario: form.fuso,
        info_idade_cliente: form.idadeInfo,
        arquivar_ficha_automatico: form.arquivar,
        bloqueio_eventos_clinicos: form.bloqueio,
        empresa: empresaId,
      };

      await empresasService.parametros.update(empresaId, data);
      setMensagem({ tipo: 'sucesso', texto: 'Parâmetros salvos com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar parâmetros:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.detail || 'Erro ao salvar parâmetros' 
      });
    } finally {
      setLoading(false);
    }
  }

  const FUSOS_BR = [
    { value: 'America/Noronha', label: 'Fernando de Noronha (UTC-2)' },
    { value: 'America/Sao_Paulo', label: 'Sul e Sudeste (GO, DF, MG, ES, RJ, SP, PR, SC, RS) — UTC-3' },
    { value: 'America/Fortaleza', label: 'Nordeste (MA, PI, CE, RN, PB, PE, AL, SE, BA) — UTC-3' },
    { value: 'America/Belem', label: 'Amapá e Pará — UTC-3' },
    { value: 'America/Cuiaba', label: 'Mato Grosso — UTC-4' },
    { value: 'America/Campo_Grande', label: 'Mato Grosso do Sul — UTC-4' },
    { value: 'America/Manaus', label: 'Amazonas (maior parte) — UTC-4' },
    { value: 'America/Porto_Velho', label: 'Rondônia — UTC-4' },
    { value: 'America/Boa_Vista', label: 'Roraima — UTC-4' },
    { value: 'America/Rio_Branco', label: 'Acre e extremo oeste do Amazonas — UTC-5' },
  ];

  return (
    <form className="empresa-parametros-form" onSubmit={handleSubmit}>
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Fuso Horário */}
      <div className="form-group">
        <label htmlFor="fuso">Fuso Horário</label>
        <select 
          id="fuso" 
          value={form.fuso || ''} 
          onChange={e => setForm(prev => ({ ...prev, fuso: e.target.value }))}
          disabled={loading}
          className={erros.fuso ? 'erro' : ''}
        >
          {FUSOS_BR.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {erros.fuso && <span className="erro-mensagem">{erros.fuso}</span>}
      </div>

      {/* Informação sobre idade do cliente */}
      <div className="form-group">
        <label>Informação sobre idade do cliente?</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-btn toggle-aniversario${form.idadeInfo === 'aniversario' ? ' selected' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, idadeInfo: 'aniversario' }))}
            disabled={loading}
          >
            Somente aniversário
          </button>
          <button
            type="button"
            className={`toggle-btn toggle-nascimento${form.idadeInfo === 'nascimento' ? ' selected' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, idadeInfo: 'nascimento' }))}
            disabled={loading}
          >
            Data de nascimento
          </button>
        </div>
        {erros.idadeInfo && <span className="erro-mensagem">{erros.idadeInfo}</span>}
      </div>

      {/* Arquivar ficha do cliente automaticamente */}
      <div className="form-group">
        <label>Arquivar ficha do cliente automaticamente após 5 anos sem comprar?</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-btn toggle-sim${form.arquivar ? ' selected' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, arquivar: true }))}
            disabled={loading}
          >
            Sim
          </button>
          <button
            type="button"
            className={`toggle-btn toggle-nao${!form.arquivar ? ' selected' : ''}`}
            onClick={() => setForm(prev => ({ ...prev, arquivar: false }))}
            disabled={loading}
          >
            Não
          </button>
        </div>
      </div>

      {/* Bloqueio dos eventos clínicos */}
      <div className="form-group">
        <label htmlFor="bloqueio">Bloqueio dos eventos clínicos</label>
        <select 
          id="bloqueio" 
          value={form.bloqueio || ''} 
          onChange={e => setForm(prev => ({ ...prev, bloqueio: e.target.value }))}
          disabled={loading}
          className={erros.bloqueio ? 'erro' : ''}
        >
          <option value="nao_bloquear">Não bloquear</option>
          <option value="1_hora">1 hora após a inclusão</option>
          <option value="2_horas">2 horas após a inclusão</option>
          <option value="6_horas">6 horas após a inclusão</option>
          <option value="8_horas">8 horas após a inclusão</option>
          <option value="12_horas">12 horas após a inclusão</option>
          <option value="1_dia">1 dia após a inclusão</option>
          <option value="2_dias">2 dias após a inclusão</option>
          <option value="3_dias">3 dias após a inclusão</option>
          <option value="7_dias">7 dias após a inclusão</option>
          <option value="14_dias">14 dias após a inclusão</option>
          <option value="21_dias">21 dias após a inclusão</option>
          <option value="30_dias">30 dias após a inclusão</option>
        </select>
        {erros.bloqueio && <span className="erro-mensagem">{erros.bloqueio}</span>}
      </div>

      {/* Botão de salvar */}
      <div className="parametros-actions">
        <button type="submit" className="btn-salvar" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 