import api from './api';

export interface AssinaturaDto {
  id?: number;
  planoId: number;
  clienteNome?: string;
  clienteEmail?: string | null;
  tipoRecorrencia: string;
  formaPagamento: string;
  status?: string; 
}

const AssinaturaService = {
  getAll: async () => {
    const response = await api.get('/assinaturas');
    return response.data;
  },

  create: async (data: AssinaturaDto) => {
    const response = await api.post('/assinaturas', data);
    return response.data;
  },

  update: async (id: number, data: AssinaturaDto) => {    
    const body = { ...data, id: id };
    const response = await api.put(`/assinaturas/${id}`, body);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/assinaturas/${id}`);
    return response.data;
  },

  reactivate: async (id: number) => { 
    const response = await api.patch(`/assinaturas/${id}/reativar`);
    return response.data;
  }
};

export default AssinaturaService;