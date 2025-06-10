import api from './api';

class AuthService {
    async login(email, password) {
        try {
            // Tenta login com JWT
            const response = await api.post('/accounts/token/', { email, password });
            
            // Salva os tokens e dados do usuário
            const userData = {
                access: response.data.access,
                refresh: response.data.refresh,
                user: response.data.user,
                profile: response.data.profile
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Erro no login:', error);
            throw this.handleError(error);
        }
    }

    async refreshToken() {
        try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await api.post('/accounts/token/refresh/', {
                refresh: refreshToken
            });

            if (response.data.access) {
                const userData = this.getCurrentUser();
                userData.access = response.data.access;
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            }
            throw new Error('Failed to refresh token');
        } catch (error) {
            this.logout();
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    getRefreshToken() {
        const user = this.getCurrentUser();
        return user?.refresh;
    }

    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user && !!user.access;
    }

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user?.access) {
            return { Authorization: `Bearer ${user.access}` };
        }
        return {};
    }

    handleError(error) {
        console.error('Erro detalhado:', error);
        
        if (error.response) {
            // O servidor respondeu com um status de erro
            if (error.response.status === 401) {
                this.logout();
                return new Error('Credenciais inválidas');
            }
            return new Error(error.response.data.error || 'Erro no servidor');
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            return new Error('Não foi possível conectar ao servidor');
        } else {
            // Erro na configuração da requisição
            return new Error('Erro ao processar a requisição');
        }
    }
}

const authService = new AuthService();
export default authService; 