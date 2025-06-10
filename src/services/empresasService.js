import api from './api';

export const empresasService = {
  // Obter todas as empresas
  getAll: async () => {
    try {
      const response = await api.get('/empresas/');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      throw error;
    }
  },

  // Obter uma empresa específica
  getById: async (id) => {
    try {
      const response = await api.get(`/empresas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar empresa ${id}:`, error);
      throw error;
    }
  },

  // Criar uma nova empresa
  create: async (data) => {
    try {
      const response = await api.post('/empresas/', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw error;
    }
  },

  // Atualizar uma empresa
  update: async (id, data) => {
    try {
      const response = await api.put(`/empresas/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar empresa ${id}:`, error);
      throw error;
    }
  },

  // Deletar uma empresa
  delete: async (id) => {
    try {
      const response = await api.delete(`/empresas/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar empresa ${id}:`, error);
      throw error;
    }
  },

  // Gerenciar endereço
  endereco: {
    get: async (empresaId) => {
      try {
        const response = await api.get(`/empresas/${empresaId}/endereco/`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar endereço da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    update: async (empresaId, data) => {
      try {
        const response = await api.put(`/empresas/${empresaId}/endereco/`, data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar endereço da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    create: async (empresaId, data) => {
      try {
        const response = await api.post(`/empresas/${empresaId}/endereco/`, data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao criar endereço da empresa ${empresaId}:`, error);
        throw error;
      }
    }
  },

  // Gerenciar logomarca
  logomarca: {
    get: async (empresaId) => {
      try {
        const response = await api.get(`/empresas/${empresaId}/logomarca/`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar logomarca da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    update: async (empresaId, formData) => {
      try {
        const response = await api.put(`/empresas/${empresaId}/logomarca/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar logomarca da empresa ${empresaId}:`, error);
        throw error;
      }
    }
  },

  // Gerenciar parâmetros
  parametros: {
    get: async (empresaId) => {
      try {
        const response = await api.get(`/empresas/${empresaId}/parametros/`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar parâmetros da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    update: async (empresaId, data) => {
      try {
        const response = await api.put(`/empresas/${empresaId}/parametros/`, data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar parâmetros da empresa ${empresaId}:`, error);
        throw error;
      }
    }
  },

  // Gerenciar responsáveis
  responsaveis: {
    getAll: async (empresaId) => {
      try {
        const response = await api.get(`/empresas/${empresaId}/responsaveis/`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao buscar responsáveis da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    add: async (empresaId, data) => {
      try {
        const response = await api.post(`/empresas/${empresaId}/responsaveis/`, data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao adicionar responsável na empresa ${empresaId}:`, error);
        throw error;
      }
    },
    update: async (empresaId, responsavelId, data) => {
      try {
        const response = await api.put(`/empresas/${empresaId}/responsaveis/${responsavelId}/`, data);
        return response.data;
      } catch (error) {
        console.error(`Erro ao atualizar responsável ${responsavelId} da empresa ${empresaId}:`, error);
        throw error;
      }
    },
    remove: async (empresaId, responsavelId) => {
      try {
        const response = await api.delete(`/empresas/${empresaId}/responsaveis/${responsavelId}/`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao remover responsável ${responsavelId} da empresa ${empresaId}:`, error);
        throw error;
      }
    }
  }
}; 