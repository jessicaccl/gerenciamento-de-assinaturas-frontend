import api from './api';

export interface LoginRequest {
  Email: string;
  Senha: string;
}

export interface RegisterRequest {
  Nome: string;
  Email: string;
  Senha: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  dataCadastro?: string;
}

const AuthService = {
  login: async (credentials: LoginRequest): Promise<{ email: string; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async (): Promise<UsuarioLogado> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  validatePassword: async (senha: string) => {   
    const response = await api.post('/auth/validate-password', { Senha: senha });
    return response.data; 
  }
};

export default AuthService;