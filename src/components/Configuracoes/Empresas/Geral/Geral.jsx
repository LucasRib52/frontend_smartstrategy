import React, { useState, useEffect } from 'react';
import { empresasService } from '../../../../services/empresasService';
import './Geral.css';

// Funções de validação e máscara
const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) digito1 = 0;
  if (digito1 !== parseInt(cnpj.charAt(12))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) digito2 = 0;
  if (digito2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
};

const mascaraCNPJ = (valor) => {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
  valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
  valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
  return valor;
};

const mascaraIE = (valor) => {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  return valor;
};

const mascaraIM = (valor) => {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  return valor;
};

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 > 9) digito1 = 0;
  if (digito1 !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 > 9) digito2 = 0;
  if (digito2 !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

const mascaraCPF = (valor) => {
  valor = valor.replace(/\D/g, '');
  valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  valor = valor.replace(/\.(\d{3})(\d)/, '.$1-$2');
  return valor;
};

/**
 * Aba Geral do cadastro de empresa
 * Formulário visual conforme layout da imagem enviada, com seleção de tipo (jurídica/física).
 */
export default function Geral() {
  // Estados locais para os campos do formulário
  const [form, setForm] = useState({
    tipo: 'PJ',
    nomeFantasia: '',
    sigla: '',
    cnpj: '',
    cpf: '',
    razaoSocial: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
    registroCRMV_UF: '',
    registroCRMV_Num: '',
    email: '',
    telefone1: '',
    telefone2: '',
    telefone3: '',
    site: '',
    redesSociais: ['https://www.instagram.com/'],
    novaRedeSocial: '',
    horario: '',
  });

  // Estados para mensagens de erro
  const [erros, setErros] = useState({
    cnpj: '',
    cpf: '',
    inscricaoEstadual: '',
    inscricaoMunicipal: '',
  });

  // Estado para controle de loading
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [empresaId, setEmpresaId] = useState(null);

  // Carregar dados da empresa ao montar o componente
  useEffect(() => {
    const carregarEmpresaInicial = async () => {
      try {
        setLoading(true);
        // Buscar todas as empresas e pegar a de maior ID (última criada)
        const response = await empresasService.getAll();
        // Aceita tanto array simples quanto resposta paginada
        const empresas = Array.isArray(response) ? response : response.results || [];
        console.log('Empresas retornadas do backend:', empresas);
        if (empresas && empresas.length > 0) {
          // Ordena por ID decrescente e pega a primeira
          const ultimaEmpresa = empresas.sort((a, b) => b.id - a.id)[0];
          console.log('Última empresa encontrada:', ultimaEmpresa);
          setEmpresaId(ultimaEmpresa.id);
          await carregarEmpresa(ultimaEmpresa.id);
        } else {
          console.log('Nenhuma empresa encontrada no backend.');
        }
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
        setMensagem({ tipo: 'erro', texto: 'Erro ao carregar dados da empresa' });
      } finally {
        setLoading(false);
      }
    };
    carregarEmpresaInicial();
  }, []);

  // Função para carregar dados da empresa
  async function carregarEmpresa(id) {
    if (!id) {
      console.log('Nenhum ID de empresa fornecido para carregarEmpresa.');
      return;
    }
    
    try {
      setLoading(true);
      const data = await empresasService.getById(id);
      console.log('Dados retornados do backend para empresa', id, ':', data);
      // Mapear dados da API para o formato do formulário
      setForm({
        tipo: data.tipo || 'PJ',
        nomeFantasia: data.nome_fantasia || '',
        sigla: data.sigla || '',
        cnpj: data.cnpj ? mascaraCNPJ(data.cnpj) : '',
        cpf: data.cpf ? mascaraCPF(data.cpf) : '',
        razaoSocial: data.razao_social || '',
        inscricaoEstadual: data.inscricao_estadual ? mascaraIE(data.inscricao_estadual) : '',
        inscricaoMunicipal: data.inscricao_municipal ? mascaraIM(data.inscricao_municipal) : '',
        registroCRMV_UF: data.registro_crmv_uf || '',
        registroCRMV_Num: data.registro_crmv_numero || '',
        email: data.email_comercial || '',
        telefone1: data.telefone1 || '',
        telefone2: data.telefone2 || '',
        telefone3: data.telefone3 || '',
        site: data.site || '',
        redesSociais: data.redes_sociais || ['https://www.instagram.com/'],
        novaRedeSocial: '',
        horario: data.horario_funcionamento || '',
      });
    } catch (error) {
      console.error('Erro ao carregar empresa:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar dados da empresa' });
    } finally {
      setLoading(false);
    }
  }

  // Função para atualizar campos
  function handleChange(e) {
    const { name, value } = e.target;
    let valorFormatado = value;
    let erro = '';

    switch (name) {
      case 'cnpj':
        valorFormatado = mascaraCNPJ(value);
        if (valorFormatado.length === 18 && !validarCNPJ(valorFormatado)) {
          erro = 'CNPJ inválido';
        }
        break;
      case 'cpf':
        valorFormatado = mascaraCPF(value);
        if (valorFormatado.length === 14 && !validarCPF(valorFormatado)) {
          erro = 'CPF inválido';
        }
        break;
      case 'inscricaoEstadual':
        valorFormatado = mascaraIE(value);
        if (valorFormatado.length > 0 && valorFormatado.length < 9) {
          erro = 'Inscrição Estadual incompleta';
        }
        break;
      case 'inscricaoMunicipal':
        valorFormatado = mascaraIM(value);
        if (valorFormatado.length > 0 && valorFormatado.length < 9) {
          erro = 'Inscrição Municipal incompleta';
        }
        break;
      default:
        valorFormatado = value;
    }

    setForm((prev) => ({ ...prev, [name]: valorFormatado }));
    setErros((prev) => ({ ...prev, [name]: erro }));
  }

  // Função para trocar tipo de pessoa
  function handleTipoChange(tipo) {
    setForm((prev) => ({ ...prev, tipo }));
  }

  // Função para adicionar rede social
  function adicionarRedeSocial() {
    if (form.novaRedeSocial && !form.redesSociais.includes(form.novaRedeSocial)) {
      setForm((prev) => ({
        ...prev,
        redesSociais: [...prev.redesSociais, prev.novaRedeSocial],
        novaRedeSocial: '',
      }));
    }
  }

  // Função para remover rede social
  function removerRedeSocial(url) {
    setForm((prev) => ({
      ...prev,
      redesSociais: prev.redesSociais.filter((r) => r !== url),
    }));
  }

  // Função para validar todos os campos
  function validarCampos() {
    const novosErros = {};
    let valido = true;

    // Validar campos obrigatórios
    if (!form.nomeFantasia) {
      novosErros.nomeFantasia = 'Nome Fantasia é obrigatório';
      valido = false;
    }

    if (!form.sigla) {
      novosErros.sigla = 'Sigla é obrigatória';
      valido = false;
    }

    if (!form.email) {
      novosErros.email = 'Email é obrigatório';
      valido = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      novosErros.email = 'Email inválido';
      valido = false;
    }

    if (!form.telefone1) {
      novosErros.telefone1 = 'Telefone é obrigatório';
      valido = false;
    }

    // Validar campos específicos por tipo
    if (form.tipo === 'PJ') {
      if (!form.cnpj) {
        novosErros.cnpj = 'CNPJ é obrigatório';
        valido = false;
      } else if (!validarCNPJ(form.cnpj)) {
        novosErros.cnpj = 'CNPJ inválido';
        valido = false;
      }

      if (!form.razaoSocial) {
        novosErros.razaoSocial = 'Razão Social é obrigatória';
        valido = false;
      }
    } else {
      if (!form.cpf) {
        novosErros.cpf = 'CPF é obrigatório';
        valido = false;
      } else if (!validarCPF(form.cpf)) {
        novosErros.cpf = 'CPF inválido';
        valido = false;
      }
    }

    setErros(novosErros);
    return valido;
  }

  // Função para remover máscaras
  function removerMascaras(dados) {
    return {
      ...dados,
      cnpj: dados.cnpj ? dados.cnpj.replace(/\D/g, '') : '',
      cpf: dados.cpf ? dados.cpf.replace(/\D/g, '') : '',
      telefone1: dados.telefone1 ? dados.telefone1.replace(/\D/g, '') : '',
      telefone2: dados.telefone2 ? dados.telefone2.replace(/\D/g, '') : '',
      telefone3: dados.telefone3 ? dados.telefone3.replace(/\D/g, '') : '',
      inscricaoEstadual: dados.inscricaoEstadual ? dados.inscricaoEstadual.replace(/\D/g, '') : '',
      inscricaoMunicipal: dados.inscricaoMunicipal ? dados.inscricaoMunicipal.replace(/\D/g, '') : '',
    };
  }

  // Função para salvar dados
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validarCampos()) {
      return;
    }

    try {
      setLoading(true);
      const dadosFormatados = removerMascaras(form);
      
      // Preparar dados para envio
      const dadosEmpresa = {
        tipo: form.tipo,
        nome_fantasia: form.nomeFantasia,
        sigla: form.sigla,
        cnpj: dadosFormatados.cnpj,
        cpf: dadosFormatados.cpf,
        razao_social: form.razaoSocial,
        inscricao_estadual: dadosFormatados.inscricaoEstadual,
        inscricao_municipal: dadosFormatados.inscricaoMunicipal,
        registro_crmv_uf: form.registroCRMV_UF,
        registro_crmv_numero: form.registroCRMV_Num,
        email_comercial: form.email,
        telefone1: dadosFormatados.telefone1,
        telefone2: dadosFormatados.telefone2,
        telefone3: dadosFormatados.telefone3,
        site: form.site,
        redes_sociais: form.redesSociais,
        horario_funcionamento: form.horario,
      };
      
      let response;
      if (empresaId) {
        // Atualizar empresa existente
        response = await empresasService.update(empresaId, dadosEmpresa);
      } else {
        // Criar nova empresa
        response = await empresasService.create(dadosEmpresa);
        setEmpresaId(response.id);
      }

      setMensagem({ tipo: 'sucesso', texto: 'Empresa salva com sucesso!' });
      
      // Recarregar dados da empresa após salvar
      await carregarEmpresa(response.id);
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar empresa' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="empresa-geral-form" onSubmit={handleSubmit}>
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}
      
      {/* Seletor de tipo de pessoa */}
      <div className="tipo-toggle-group">
        <span className="tipo-label">Tipo*</span>
        <button
          type="button"
          className={`tipo-toggle-btn${form.tipo === 'PJ' ? ' selected' : ''}`}
          onClick={() => handleTipoChange('PJ')}
        >
          Pessoa Jurídica
        </button>
        <button
          type="button"
          className={`tipo-toggle-btn${form.tipo === 'PF' ? ' selected' : ''}`}
          onClick={() => handleTipoChange('PF')}
        >
          Pessoa Física
        </button>
      </div>

      <div className="empresa-geral-grid">
        {/* Campos dinâmicos conforme tipo */}
        {form.tipo === 'PJ' ? (
          <>
            {/* CNPJ */}
            <div className="form-group">
              <label htmlFor="cnpj">CNPJ*</label>
              <input 
                id="cnpj" 
                name="cnpj" 
                value={form.cnpj} 
                onChange={handleChange} 
                required 
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
              {erros.cnpj && <span className="erro-mensagem">{erros.cnpj}</span>}
            </div>
            {/* Razão Social */}
            <div className="form-group">
              <label htmlFor="razaoSocial">Razão Social*</label>
              <input 
                id="razaoSocial" 
                name="razaoSocial" 
                value={form.razaoSocial} 
                onChange={handleChange} 
                required 
              />
            </div>
          </>
        ) : (
          <>
            {/* CPF */}
            <div className="form-group">
              <label htmlFor="cpf">CPF*</label>
              <input 
                id="cpf" 
                name="cpf" 
                value={form.cpf} 
                onChange={handleChange} 
                required 
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {erros.cpf && <span className="erro-mensagem">{erros.cpf}</span>}
            </div>
          </>
        )}

        {/* Nome Fantasia */}
        <div className="form-group">
          <label htmlFor="nomeFantasia">Nome Fantasia*</label>
          <input 
            id="nomeFantasia" 
            name="nomeFantasia" 
            value={form.nomeFantasia} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Sigla */}
        <div className="form-group">
          <label htmlFor="sigla">Sigla* <span className="info-tooltip" title="Sigla para identificação rápida.">?</span></label>
          <input 
            id="sigla" 
            name="sigla" 
            value={form.sigla} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Inscrição Estadual */}
        <div className="form-group">
          <label htmlFor="inscricaoEstadual">Inscrição Estadual</label>
          <input 
            id="inscricaoEstadual" 
            name="inscricaoEstadual" 
            value={form.inscricaoEstadual} 
            onChange={handleChange}
            placeholder="000.000.000"
            maxLength={11}
          />
          {erros.inscricaoEstadual && <span className="erro-mensagem">{erros.inscricaoEstadual}</span>}
        </div>

        {/* Inscrição Municipal */}
        <div className="form-group">
          <label htmlFor="inscricaoMunicipal">Número da inscrição municipal*</label>
          <input 
            id="inscricaoMunicipal" 
            name="inscricaoMunicipal" 
            value={form.inscricaoMunicipal} 
            onChange={handleChange} 
            required
            placeholder="000.000.000"
            maxLength={11}
          />
          {erros.inscricaoMunicipal && <span className="erro-mensagem">{erros.inscricaoMunicipal}</span>}
        </div>

        {/* Registro no CRMV */}
        <div className="form-group registro-crmv-group">
          <label>Registro no CRMV</label>
          <div className="registro-crmv-fields">
            <select 
              name="registroCRMV_UF" 
              value={form.registroCRMV_UF} 
              onChange={handleChange}
            >
              <option value="">UF</option>
              <option value="SP">SP</option>
              <option value="RJ">RJ</option>
              {/* ...outras UFs */}
            </select>
            <input 
              name="registroCRMV_Num" 
              value={form.registroCRMV_Num} 
              onChange={handleChange} 
              placeholder="Ex: 12345" 
            />
          </div>
        </div>

        {/* Email comercial */}
        <div className="form-group">
          <label htmlFor="email">Email comercial*</label>
          <input 
            id="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            type="email" 
          />
        </div>

        {/* Telefone comercial 1 */}
        <div className="form-group">
          <label htmlFor="telefone1">Telefone comercial 1*</label>
          <input 
            id="telefone1" 
            name="telefone1" 
            value={form.telefone1} 
            onChange={handleChange} 
            required 
            placeholder="(00) 00000-0000" 
          />
        </div>

        {/* Telefone comercial 2 */}
        <div className="form-group">
          <label htmlFor="telefone2">Telefone comercial 2</label>
          <input 
            id="telefone2" 
            name="telefone2" 
            value={form.telefone2} 
            onChange={handleChange} 
            placeholder="(00) 00000-0000" 
          />
        </div>

        {/* Telefone comercial 3 */}
        <div className="form-group">
          <label htmlFor="telefone3">Telefone comercial 3</label>
          <input 
            id="telefone3" 
            name="telefone3" 
            value={form.telefone3} 
            onChange={handleChange} 
            placeholder="(00) 00000-0000" 
          />
        </div>

        {/* Site */}
        <div className="form-group site-group">
          <label htmlFor="site">Site</label>
          <input 
            id="site" 
            name="site" 
            value={form.site} 
            onChange={handleChange} 
            placeholder="" 
          />
        </div>

        {/* Redes Sociais */}
        <div className="form-group redes-sociais-group">
          <label>Redes Sociais <span className="descricao">(Cole os links completos dos perfis. Ex: http://twitter.com/SimplesVet)</span></label>
          <div className="redes-sociais-list">
            {form.redesSociais.map((url) => (
              <span key={url} className="rede-social-tag">
                {url}
                <button type="button" className="remover-rede" onClick={() => removerRedeSocial(url)} title="Remover">×</button>
              </span>
            ))}
            <input
              type="url"
              name="novaRedeSocial"
              value={form.novaRedeSocial}
              onChange={handleChange}
              placeholder="https://"
              className="input-rede-social"
            />
            <button type="button" className="adicionar-rede" onClick={adicionarRedeSocial}>adicionar</button>
          </div>
        </div>

        {/* Horário de funcionamento */}
        <div className="form-group horario-group">
          <label htmlFor="horario">Horário de funcionamento</label>
          <textarea 
            id="horario" 
            name="horario" 
            value={form.horario} 
            onChange={handleChange} 
            rows={4} 
          />
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="empresa-geral-actions">
        <button type="submit" className="btn-salvar" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 