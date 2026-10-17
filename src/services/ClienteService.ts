import api from './api';
import type { ClienteResumo, FichaCliente, SalvarCliente, SituacaoCliente } from '../types/Cliente';

const ClienteService = {
  getAll: async (filtro: { busca?: string; situacao?: SituacaoCliente } = {}): Promise<ClienteResumo[]> => {
    const response = await api.get('/clientes', { params: filtro });
    return response.data;
  },

  getFicha: async (id: number): Promise<FichaCliente> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  create: async (dados: SalvarCliente): Promise<{ id: number; message: string }> => {
    const response = await api.post('/clientes', dados);
    return response.data;
  },

  update: async (id: number, dados: SalvarCliente) => {
    const response = await api.put(`/clientes/${id}`, dados);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/clientes/${id}`);
  },

  enviarLembrete: async (id: number): Promise<{ message: string }> => {
    const response = await api.post(`/clientes/${id}/lembrete`);
    return response.data;
  }
};

export default ClienteService;
