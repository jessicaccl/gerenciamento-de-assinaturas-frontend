import api from './api';
import type { CicloDePreco } from '../types/Cobranca';

export interface PlanoDto {
  id?: number;
  nome: string;
  valor: number;
  descricao: string;
  ativo?: boolean;
}

const PlanoService = {
  getAll: async () => {
    const response = await api.get('/planos');
    return response.data;
  },
  create: async (data: PlanoDto) => {
    const response = await api.post('/planos', data);
    return response.data;
  },
  update: async (id: number, data: PlanoDto) => {
    const body = { ...data, id: id };
    
    const response = await api.put(`/planos/${id}`, body);
    return response.data;
  },
  getCiclos: async (id: number): Promise<CicloDePreco[]> => {
    const response = await api.get(`/planos/${id}/ciclos`);
    return response.data;
  },
  delete: async (id: number, senhaAdmin: string) => {   
    const response = await api.delete(`/planos/${id}`, { data: { senha: senhaAdmin } });
    return response.data;
  }
};

export default PlanoService;