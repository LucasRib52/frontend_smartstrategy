import api from './api';
import { authService } from './auth/authService';

/**
 * Serviço para gerenciar convites de usuários
 */
const conviteService = {
    /**
     * Lista todos os convites do usuário
     */
    listarConvites: async () => {
        const response = await api.get('/convite_notificacao/convites/');
        return response.data;
    },

    /**
     * Lista convites pendentes do usuário
     */
    listarConvitesPendentes: async () => {
        const response = await api.get('/convite_notificacao/convites/pendentes/');
        return response.data;
    },

    /**
     * Envia um novo convite
     * @param {Object} data - Dados do convite
     * @param {string} data.email - Email do usuário convidado
     * @param {string} data.position - Cargo do usuário
     * @param {Object} data.permissions - Permissões do usuário
     */
    enviarConvite: async (data) => {
        const response = await api.post('/convite_notificacao/convites/', data);
        return response.data;
    },

    /**
     * Aceita um convite
     * @param {number} id - ID do convite
     */
    aceitarConvite: async (id) => {
        const response = await api.post(`/convite_notificacao/convites/${id}/aceitar/`);
        return response.data;
    },

    /**
     * Recusa um convite
     * @param {number} id - ID do convite
     */
    recusarConvite: async (id) => {
        const response = await api.post(`/convite_notificacao/convites/${id}/recusar/`);
        return response.data;
    }
};

export default conviteService; 