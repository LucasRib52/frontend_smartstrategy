import api from '../api';

// URL base da API
const API_URL = 'https://smartstrategy.pythonanywhere.com/api';

// Configuração global do axios
api.defaults.withCredentials = true;

/**
 * Serviço de autenticação
 * Gerencia todas as operações relacionadas à autenticação do usuário
 * Utiliza a autenticação baseada em sessão do Django
 */
export const authService = {
    /**
     * Registra um novo usuário
     * @param {Object} data - Dados do usuário
     * @param {string} data.email - Email do usuário
     * @param {string} data.password - Senha do usuário
     * @param {string} data.userType - Tipo de usuário (PF ou PJ)
     * @param {Object} data.personData - Dados específicos para pessoa física
     * @param {Object} data.companyData - Dados específicos para empresa
     * @returns {Promise} - Retorna os dados do usuário registrado
     */
    async register(data) {
        try {
            const formattedData = {
                email: data.email,
                password: data.password,
                username: data.email.split('@')[0],
            };

            // Adiciona os campos específicos baseado no tipo de usuário
            if (data.userType === 'PF') {
                Object.assign(formattedData, {
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    position: data.position
                });
            } else {
                Object.assign(formattedData, {
                    company_name: data.companyName,
                    trade_name: data.tradeName,
                    cnpj: data.cnpj,
                    state_registration: data.stateRegistration || '',
                    municipal_registration: data.municipalRegistration,
                    responsible_name: data.responsibleName,
                    phone1: data.phone1,
                    phone2: data.phone2 || '',
                    website: data.website || ''
                });
            }

            // Escolhe o endpoint correto baseado no tipo de usuário
            const endpoint = data.userType === 'PF' 
                ? '/accounts/register/person/'
                : '/accounts/register/company/';

            const response = await api.post(endpoint, formattedData, {
                withCredentials: true
            });

            return {
                success: true,
                message: 'Cadastro realizado com sucesso! Redirecionando para o login...',
                data: response.data
            };
        } catch (error) {
            console.error('Erro no registro:', error.response?.data);
            
            if (error.response?.status === 400) {
                const errorData = error.response.data;
                
                // Verifica erros específicos
                if (errorData.email) {
                    throw new Error(errorData.email[0]);
                }
                if (errorData.cpf) {
                    throw new Error(errorData.cpf[0]);
                }
                if (errorData.cnpj) {
                    throw new Error(errorData.cnpj[0]);
                }
                if (errorData.non_field_errors) {
                    throw new Error(errorData.non_field_errors[0]);
                }
                
                // Se houver outros erros de validação, mostra o primeiro erro encontrado
                const firstError = Object.values(errorData)[0];
                if (Array.isArray(firstError)) {
                    throw new Error(firstError[0]);
                }
                
                throw new Error('Por favor, verifique os dados informados e tente novamente.');
            }
            
            if (error.response?.status === 500) {
                console.error('Erro interno do servidor:', error.response.data);
                // Verifica se o erro é relacionado a CNPJ duplicado
                if (error.response.data?.detail?.includes('UNIQUE constraint failed: accounts_companyprofile.cnpj')) {
                    throw new Error('Este CNPJ já está cadastrado no sistema.');
                }
                throw new Error('Erro interno do servidor. Por favor, tente novamente mais tarde.');
            }
            
            throw new Error('Erro ao criar conta. Por favor, tente novamente mais tarde.');
        }
    },

    /**
     * Realiza o login do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise} - Retorna os dados da sessão
     */
    async login(email, password) {
        try {
            const response = await api.post('/accounts/login/', {
                email,
                password
            }, {
                withCredentials: true
            });
            
            // Salva os dados do usuário no localStorage
            localStorage.setItem('user', JSON.stringify(response.data));

            // Se for PJ, define a empresa automaticamente
            if (response.data.user?.user_type === 'PJ') {
                localStorage.setItem('empresaSelecionada', 'true');
            }
            
            return response.data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },

    /**
     * Realiza o logout do usuário
     * @returns {Promise} - Retorna a resposta do servidor
     */
    async logout() {
        try {
            const response = await api.post('/accounts/logout/', {}, {
                withCredentials: true
            });
            localStorage.removeItem('user');
            return response.data;
        } catch (error) {
            console.error('Erro no logout:', error);
            throw error;
        }
    },

    /**
     * Verifica se o usuário está autenticado
     * @returns {Promise<boolean>} - Retorna true se o usuário estiver autenticado
     */
    async isAuthenticated() {
        try {
            const response = await api.get('/accounts/profile/', {
                withCredentials: true
            });
            console.log('Resposta do perfil:', response.data);
            return !!response.data;
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            return false;
        }
    },

    /**
     * Obtém os dados do usuário atual
     * @returns {Object|null} - Retorna os dados do usuário ou null se não estiver autenticado
     */
    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    /**
     * Obtém o header de autorização com o token JWT
     * @returns {Object} - Retorna o objeto com o header de autorização
     */
    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user?.token) {
            return { Authorization: `Bearer ${user.token}` };
        }
        return {};
    },

    /**
     * Obtém o refresh token
     * @returns {string|null} - Retorna o refresh token ou null se não existir
     */
    getRefreshToken() {
        const user = this.getCurrentUser();
        return user?.refresh_token || null;
    },

    /**
     * Atualiza o token JWT usando o refresh token
     * @returns {Promise} - Retorna uma promise com o novo token
     */
    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await api.post('/accounts/token/refresh/', {
                refresh: refreshToken
            });

            const user = this.getCurrentUser();
            user.token = response.data.access;
            localStorage.setItem('user', JSON.stringify(user));

            return response.data.access;
        } catch (error) {
            console.error('Erro ao atualizar token:', error);
            throw error;
        }
    },

    async getProfile() {
        const response = await api.get('/accounts/profile/', {
            withCredentials: true
        });
        return response.data;
    }
}; 