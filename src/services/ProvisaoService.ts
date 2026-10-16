import api from './api';
import type { PainelDeProvisoes } from '../types/Provisoes';

const ProvisaoService = {
  getPainel: async (mesesFuturos: number): Promise<PainelDeProvisoes> => {
    const response = await api.get('/provisoes', { params: { mesesFuturos } });
    return response.data;
  }
};

export default ProvisaoService;
