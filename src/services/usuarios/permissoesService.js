import axios from 'axios';
import api from '../api';

const API_URL = '/permissoes';

// Removendo a configuração duplicada do axios já que estamos usando a instância importada
// que já tem todas as configurações necessárias

export const permissoesService = {
    // Listar todos os módulos disponíveis
    listarModulos: async () => {
        const response = await api.get(`${API_URL}/modulos/`);
        return response.data;
    },

    // Listar permissões de todos os usuários
    listarPermissoes: async () => {
        const response = await api.get(`${API_URL}/usuarios/`);
        return response.data;
    },

    // Obter permissões de um vínculo específico
    obterPermissoesUsuario: async (linkId) => {
        const response = await api.get(`${API_URL}/usuarios/${linkId}/`);
        return response.data;
    },

    // Atualizar permissões de um vínculo
    atualizarPermissoes: async (linkId, permissoes) => {
        const response = await api.put(`${API_URL}/usuarios/${linkId}/`, {
            permissions: {
                modulos: permissoes
            }
        });
        return response.data;
    },

    // Obter módulos disponíveis para um vínculo
    obterModulosDisponiveis: async (linkId) => {
        try {
            // Se o linkId for o ID do usuário, precisamos buscar o vínculo ativo primeiro
            if (typeof linkId === 'string' && linkId.includes('@')) {
                // É um email, precisamos buscar o vínculo
                const response = await api.get('/usuarios/links/');
                const links = response.data;
                const linkAtivo = links.find(link => 
                    link.user.email === linkId && 
                    link.status === 'accepted'
                );
                
                if (!linkAtivo) {
                    throw new Error('Vínculo não encontrado');
                }
                
                linkId = linkAtivo.id;
            }
            
            const response = await api.get(`${API_URL}/usuarios/${linkId}/modulos_disponiveis/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter módulos disponíveis:', error);
            throw error;
        }
    }
}; 