import React, { useRef, useState, useEffect } from 'react';
import { empresasService } from '../../../../services/empresasService';
import './Logomarca.css';

/**
 * Aba Logomarca do cadastro de empresa
 * Permite selecionar e visualizar a logomarca, seguindo o layout da imagem enviada.
 */
export default function Logomarca() {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const fileInputRef = useRef();

  // Carregar logomarca ao montar o componente
  useEffect(() => {
    carregarLogomarca();
  }, []);

  // Função para carregar logomarca
  async function carregarLogomarca() {
    try {
      setLoading(true);
      const data = await empresasService.logomarca.get(1); // Assumindo que é a empresa 1
      
      if (data && data.imagem) {
        setPreview(data.imagem);
      }
    } catch (error) {
      console.error('Erro ao carregar logomarca:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao carregar logomarca' });
    } finally {
      setLoading(false);
    }
  }

  // Função para lidar com seleção de imagem
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        
        // Validar o tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMensagem({ tipo: 'erro', texto: 'O arquivo deve ter no máximo 5MB' });
          return;
        }
        
        // Validar o tipo do arquivo
        if (!file.type.startsWith('image/')) {
          setMensagem({ tipo: 'erro', texto: 'O arquivo deve ser uma imagem' });
          return;
        }
        
        // Validar a extensão
        if (!file.name.toLowerCase().endsWith('.png') && 
            !file.name.toLowerCase().endsWith('.jpg') && 
            !file.name.toLowerCase().endsWith('.jpeg')) {
          setMensagem({ tipo: 'erro', texto: 'O arquivo deve ser PNG, JPG ou JPEG' });
          return;
        }
        
        // Criar um FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('imagem', file);

        // Enviar para a API
        await empresasService.logomarca.update(1, formData);
        
        // Atualizar preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
        
        setMensagem({ tipo: 'sucesso', texto: 'Logomarca atualizada com sucesso!' });
      } catch (error) {
        console.error('Erro ao atualizar logomarca:', error);
        setMensagem({ 
          tipo: 'erro', 
          texto: error.response?.data?.detail || error.response?.data?.imagem?.[0] || 'Erro ao atualizar logomarca' 
        });
      } finally {
        setLoading(false);
      }
    }
  }

  // Função para acionar o input de arquivo
  function handleSelectImage() {
    fileInputRef.current.click();
  }

  return (
    <form className="empresa-logomarca-form">
      {mensagem.texto && (
        <div className={`mensagem ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      {/* Botão de selecionar imagem */}
      <button 
        type="button" 
        className="btn-selecionar-imagem" 
        onClick={handleSelectImage}
        disabled={loading}
      >
        <span role="img" aria-label="Upload">📤</span> 
        {loading ? 'Enviando...' : 'Selecionar imagem'}
      </button>

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImageChange}
        disabled={loading}
      />

      {/* Alerta vermelho de instrução */}
      <div className="logomarca-alerta-vermelho">
        <strong>Atenção!</strong> A imagem deve ter no máximo 200px de largura e ter <b>PREFERENCIALMENTE</b> o fundo <b>TRANSPARENTE</b> e formato <b>.PNG</b>.
      </div>

      {/* Preview da imagem */}
      <div className="logomarca-preview-wrapper">
        {preview && (
          <img src={preview} alt="Preview da logomarca" className="logomarca-preview" />
        )}
      </div>
    </form>
  );
} 