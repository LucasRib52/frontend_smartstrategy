import api from './api';

export const vendaService = {
  // List all sales
  getAll: async () => {
    try {
      const response = await api.get('/vendas/');
      console.log('Resposta bruta da API:', response);
      
      // Verificar se a resposta está paginada
      if (response?.data?.results) {
        return response.data.results;
      }
      
      // Se não estiver paginada, retorna os dados diretamente
      return response.data || [];
    } catch (error) {
      console.error('Erro no getAll:', {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Get a single sale by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/vendas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro no getById:', {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Create a new sale
  create: async (data) => {
    try {
      console.log('Iniciando criação de venda...');
      console.log('Dados sendo enviados para criação:', data);
      console.log('URL da API:', api.defaults.baseURL + '/vendas/');
      
      const response = await api.post('/vendas/', data);
      console.log('Resposta da criação:', response);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no create:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        data: data,
        config: error.config
      });
      throw error;
    }
  },

  // Update a sale
  update: async (id, data) => {
    try {
      console.log('Iniciando atualização de venda...');
      console.log('ID da venda:', id);
      console.log('Dados sendo enviados para atualização:', data);
      console.log('URL da API:', api.defaults.baseURL + `/vendas/${id}/`);
      
      const response = await api.put(`/vendas/${id}/`, data);
      console.log('Resposta da atualização:', response);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado no update:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        data: data,
        id: id,
        config: error.config
      });
      throw error;
    }
  },

  // Delete a sale
  delete: async (id) => {
    try {
      const response = await api.delete(`/vendas/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erro no delete:', {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Export to CSV
  exportCSV: async () => {
    try {
      const response = await api.get('/vendas/export_csv/', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro no exportCSV:', {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Export to Excel
  exportExcel: async () => {
    try {
      const response = await api.get('/vendas/export_excel/', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro no exportExcel:', {
        message: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },

  // Get dashboard data
  getDashboardData: async (params) => {
    try {
      console.log('Fazendo requisição para o dashboard com params:', params);
      const response = await api.get('/dashboard/', { params });
      
      console.log('Resposta bruta da API:', response);
      
      if (!response.data) {
        throw new Error('Resposta vazia do servidor');
      }
      
      // Garantir que os valores numéricos são números
      const data = {
        invest_realizado: Number(response.data.invest_realizado || 0),
        invest_projetado: Number(response.data.invest_projetado || 0),
        faturamento: Number(response.data.faturamento || 0),
        clientes_novos: Number(response.data.clientes_novos || 0),
        faturamento_campanha: Number(response.data.faturamento_campanha || 0),
        leads: Number(response.data.leads || 0),
        vendas_google: Number(response.data.vendas_google || 0),
        vendas_instagram: Number(response.data.vendas_instagram || 0),
        vendas_facebook: Number(response.data.vendas_facebook || 0),
        roi: Number(response.data.roi || 0),
        ticket_medio: Number(response.data.ticket_medio || 0),
        clientes_recorrentes: Number(response.data.clientes_recorrentes || 0),
        taxa_conversao: Number(response.data.taxa_conversao || 0),
        cac: Number(response.data.cac || 0),

        // Adicionando processamento das médias
        invest_realizado_avg: Number(response.data.invest_realizado_avg || 0),
        invest_projetado_avg: Number(response.data.invest_projetado_avg || 0),
        faturamento_avg: Number(response.data.faturamento_avg || 0),
        clientes_novos_avg: Number(response.data.clientes_novos_avg || 0),
        faturamento_campanha_avg: Number(response.data.faturamento_campanha_avg || 0),
        leads_avg: Number(response.data.leads_avg || 0),
        vendas_google_avg: Number(response.data.vendas_google_avg || 0),
        vendas_instagram_avg: Number(response.data.vendas_instagram_avg || 0),
        vendas_facebook_avg: Number(response.data.vendas_facebook_avg || 0),
        roi_avg: Number(response.data.roi_avg || 0),
        ticket_medio_avg: Number(response.data.ticket_medio_avg || 0),
        clientes_recorrentes_avg: Number(response.data.clientes_recorrentes_avg || 0),
        taxa_conversao_avg: Number(response.data.taxa_conversao_avg || 0),
        cac_avg: Number(response.data.cac_avg || 0),

        labels: response.data.labels || [],
        invest_realizado_data: (response.data.invest_realizado_data || []).map(Number),
        invest_projetado_data: (response.data.invest_projetado_data || []).map(Number),
        fat_camp_realizado_data: (response.data.fat_camp_realizado_data || []).map(Number),
        fat_geral_data: (response.data.fat_geral_data || []).map(Number),
        leads_data: (response.data.leads_data || []).map(Number),
        clientes_novos_data: (response.data.clientes_novos_data || []).map(Number),
        clientes_recorrentes_data: (response.data.clientes_recorrentes_data || []).map(Number),
        vendas_google_data: (response.data.vendas_google_data || []).map(Number),
        vendas_instagram_data: (response.data.vendas_instagram_data || []).map(Number),
        vendas_facebook_data: (response.data.vendas_facebook_data || []).map(Number),
        taxa_conversao_data: (response.data.taxa_conversao_data || []).map(Number),
        roi_data: (response.data.roi_data || []).map(Number),
        ticket_medio_data: (response.data.ticket_medio_data || []).map(Number),
        cac_data: (response.data.cac_data || []).map(Number)
      };
      
      console.log('Dados processados:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        params: params
      });
      
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw error;
    }
  }
}; 