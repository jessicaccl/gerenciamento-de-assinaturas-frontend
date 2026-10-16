import api from './api';
import type { Cobranca, StatusCobranca } from '../types/Cobranca';

export interface FiltroCobrancas {
  status?: StatusCobranca;
  assinaturaId?: number;
}

const CobrancaService = {
  getAll: async (filtro: FiltroCobrancas = {}): Promise<Cobranca[]> => {
    const response = await api.get('/cobrancas', { params: filtro });
    return response.data;
  },

  registrarPagamento: async (id: number, dataPagamento: string, formaPagamento: string) => {
    const response = await api.post(`/cobrancas/${id}/pagamento`, { dataPagamento, formaPagamento });
    return response.data;
  },

  cancelar: async (id: number) => {
    const response = await api.post(`/cobrancas/${id}/cancelar`);
    return response.data;
  }
};

export default CobrancaService;
