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
  },

  enviarLembrete: async (id: number): Promise<{ message: string }> => {
    const response = await api.post(`/cobrancas/${id}/lembrete`);
    return response.data;
  },

  notificarVencidas: async (): Promise<{ message: string; enviados: number; semEmail: number }> => {
    const response = await api.post('/cobrancas/lembretes/vencidas');
    return response.data;
  },

  // Baixa o CSV gerado pela API (mesmos filtros da listagem)
  exportarCsv: async (filtro: FiltroCobrancas = {}) => {
    const response = await api.get('/cobrancas/exportar', { params: filtro, responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cobrancas-${new Date().toLocaleDateString('sv-SE')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export default CobrancaService;
