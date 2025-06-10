import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'https://smartstrategy.pythonanywhere.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir o token JWT
api.interceptors.request.use(async request => {
  console.log('Iniciando requisição:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });

  // Adiciona o token JWT se existir
  const authHeader = authService.getAuthHeader();
  console.log('Token sendo enviado:', authHeader);

  if (authHeader.Authorization) {
    request.headers['Authorization'] = authHeader.Authorization;
    console.log('Header atualizado com token:', request.headers);
  } else {
    console.log('Nenhum token encontrado para enviar');
  }

  return request;
});

// Interceptor para logar as respostas e tratar erros
api.interceptors.response.use(
  response => {
    console.log('Resposta recebida com sucesso:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  async error => {
    console.error('Erro detalhado na requisição:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });

    // Se o erro for 401 (não autenticado), tenta refresh token
    if (error.response?.status === 401) {
      console.log('Erro 401 detectado, tentando refresh token...');
      const originalRequest = error.config;
      
      // Não tenta refresh em requisições de login ou refresh
      if (originalRequest.url.includes('/accounts/token/')) {
        console.log('Erro em requisição de login/refresh, não tentando refresh token');
        return Promise.reject(error);
      }
      
      // Se não for uma tentativa de refresh e tiver refresh token
      if (!originalRequest._retry && authService.getRefreshToken()) {
        console.log('Tentando refresh token...');
        originalRequest._retry = true;
        try {
          const newToken = await authService.refreshToken();
          console.log('Novo token obtido:', newToken);
          
          // Atualiza o header com o novo token
          const authHeader = authService.getAuthHeader();
          if (authHeader.Authorization) {
            originalRequest.headers['Authorization'] = authHeader.Authorization;
            console.log('Header atualizado com novo token:', originalRequest.headers);
          }
          
          // Refaz a requisição original
          console.log('Refazendo requisição original...');
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Erro no refresh token:', refreshError);
          // Se falhar o refresh, faz logout
          authService.logout();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } else {
        console.log('Sem refresh token ou já tentou refresh, redirecionando para login');
        // Se não tiver refresh token ou falhar, redireciona para login
        authService.logout();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Se o erro for 403 (CSRF ou não autorizado)
    if (error.response?.status === 403) {
      console.log('Erro 403 detectado, redirecionando para login');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Exportando apenas a instância do axios
export default api; 