import api from '../api';

const API_URL = '/usuarios';

export const usuariosService = {
    // Listar todos os vínculos
    listarUsuarios: async () => {
        const response = await api.get(`${API_URL}/links/`);
        // Suporte a resposta paginada ou direta
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (Array.isArray(response.data.results)) {
            return response.data.results;
        } else {
            return [];
        }
    },

    // Adicionar novo usuário
    adicionarUsuario: async (dados) => {
        const response = await api.post(`${API_URL}/links/create/`, dados);
        return response.data;
    },

    // Aceitar convite
    aceitarConvite: async (id) => {
        const response = await api.post(`${API_URL}/links/${id}/accept/`);
        return response.data;
    },

    // Rejeitar convite
    rejeitarConvite: async (id) => {
        const response = await api.post(`${API_URL}/links/${id}/reject/`);
        return response.data;
    },

    // Ativar/Desativar acesso
    toggleStatus: async (id) => {
        const response = await api.post(`${API_URL}/links/${id}/toggle-status/`);
        return response.data;
    },

    // Atualizar permissões
    atualizarPermissoes: async (id, permissoes) => {
        const response = await api.put(`${API_URL}/links/${id}/`, {
            permissions: permissoes
        });
        return response.data;
    }
}; 