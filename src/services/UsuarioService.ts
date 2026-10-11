import api from './api';

export interface UsuarioDto {
  id?: number;
  nome: string;
  email: string;
  cargo?: string;
}

const ENDPOINT = '/usuario'; 

const UsuarioService = {
  getAll: async () => {
    const response = await api.get(ENDPOINT);
    return response.data;
  },
  update: async (id: number, data: UsuarioDto) => {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  }
};

export default UsuarioService;