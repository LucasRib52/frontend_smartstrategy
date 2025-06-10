import React, { useState, useEffect } from 'react';
import { empresasService } from '../../../../services/empresasService';
import './Endereco.css';

/**
 * Aba Endereço do cadastro de empresa
 * Formulário visual conforme layout da imagem enviada.
 */
export default function Endereco({ empresaId }) {
  // Estados locais para os campos do formulário
  const [form, setForm] = useState({
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    pontoReferencia: '',
    geolocalizacao: '',
    bairro: '',
    cidade: '',
    estado: 'São Paulo',
  });

  // Estado para controle de loading
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [enderecoExiste, setEnderecoExiste] = useState(false);

  // Carregar dados do endereço ao montar o componente ou quando empresaId mudar
  useEffect(() => {
    if (empresaId && empresaId > 0) {
      carregarEndereco();
    }
  }, [empresaId]);

  // Função para carregar dados do endereço
  async function carregarEndereco() {
    try {
      setLoading(true);
      const data = await empresasService.endereco.get(empresaId);
      if (data && data.id) {
        setEnderecoExiste(true);
        setForm({
          cep: data.cep || '',
          endereco: data.endereco || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          pontoReferencia: data.ponto_referencia || '',
          geolocalizacao: data.geolocalizacao || '',
          bairro: data.bairro || '',
          cidade: data.cidade || '',
          estado: data.estado || 'SP',
        });
      } else {
        setEnderecoExiste(false);
      }
    } catch (error) {
      setEnderecoExiste(false);
      // Se for 404, não faz nada (endereço não existe ainda)
      if (error.response && error.response.status !== 404) {
        console.error('Erro ao carregar endereço:', error);
        setMensagem({ tipo: 'erro', texto: 'Erro ao carregar dados do endereço' });
      }
    } finally {
      setLoading(false);
    }
  }

  // Função para formatar o CEP automaticamente
  function formatCep(value) {
    // Remove tudo que não for número
    let v = value.replace(/\D/g, '');
    // Limita a 8 dígitos
    v = v.slice(0, 8);
    // Adiciona o hífen após o quinto dígito
    if (v.length > 5) {
      v = v.slice(0, 5) + '-' + v.slice(5);
    }
    return v;
  }

  // Função para atualizar campos
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'cep') {
      setForm((prev) => ({ ...prev, cep: formatCep(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  // Função para salvar dados
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      // Mapear dados do formulário para o formato da API
      const data = {
        cep: form.cep.replace(/\D/g, ''), // Remove tudo que não for número
        endereco: form.endereco,
        numero: form.numero,
        complemento: form.complemento,
        ponto_referencia: form.pontoReferencia,
        geolocalizacao: form.geolocalizacao,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        empresa: empresaId, // Sempre enviar o campo empresa
      };
      if (!enderecoExiste) {
        // Criar endereço (POST)
        await empresasService.endereco.create(empresaId, data);
        setMensagem({ tipo: 'sucesso', texto: 'Endereço criado com sucesso!' });
        setEnderecoExiste(true);
      } else {
        // Atualizar endereço (PUT)
        await empresasService.endereco.update(empresaId, data);
        setMensagem({ tipo: 'sucesso', texto: 'Endereço atualizado com sucesso!' });
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error.response?.data || error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar dados do endereço: ' + (error.response?.data ? JSON.stringify(error.response.data) : error.message) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="empresa-endereco-form" onSubmit={handleSubmit}>
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      <div className="empresa-endereco-grid">
        {/* CEP */}
        <div className="form-group">
          <label htmlFor="cep">CEP*</label>
          <input
            id="cep"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            required
            placeholder="00000-000"
            maxLength={9}
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </div>

        {/* Endereço */}
        <div className="form-group">
          <label htmlFor="endereco">Endereço*</label>
          <input 
            id="endereco" 
            name="endereco" 
            value={form.endereco} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Número */}
        <div className="form-group">
          <label htmlFor="numero">Número*</label>
          <input 
            id="numero" 
            name="numero" 
            value={form.numero} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Complemento */}
        <div className="form-group">
          <label htmlFor="complemento">Complemento</label>
          <input 
            id="complemento" 
            name="complemento" 
            value={form.complemento} 
            onChange={handleChange} 
          />
        </div>

        {/* Ponto de referência */}
        <div className="form-group">
          <label htmlFor="pontoReferencia">Ponto de referência</label>
          <input 
            id="pontoReferencia" 
            name="pontoReferencia" 
            value={form.pontoReferencia} 
            onChange={handleChange} 
          />
        </div>

        {/* Geolocalização */}
        <div className="form-group">
          <label htmlFor="geolocalizacao">Geolocalização</label>
          <input 
            id="geolocalizacao" 
            name="geolocalizacao" 
            value={form.geolocalizacao} 
            onChange={handleChange} 
          />
        </div>

        {/* Bairro */}
        <div className="form-group">
          <label htmlFor="bairro">Bairro*</label>
          <input 
            id="bairro" 
            name="bairro" 
            value={form.bairro} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Cidade */}
        <div className="form-group">
          <label htmlFor="cidade">Cidade*</label>
          <input 
            id="cidade" 
            name="cidade" 
            value={form.cidade} 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* Estado */}
        <div className="form-group">
          <label htmlFor="estado">Estado*</label>
          <select 
            id="estado" 
            name="estado" 
            value={form.estado} 
            onChange={handleChange} 
            required
          >
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
        </div>
      </div>

      {/* Botão de salvar */}
      <div className="empresa-endereco-actions">
        <button type="submit" className="btn-salvar" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
} 