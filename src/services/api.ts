import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:5029"}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Token expirado ou inválido: limpa a sessão e volta para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const ehLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !ehLogin) {
      localStorage.removeItem("user_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Extrai uma mensagem legível das respostas de erro da API (texto simples ou ProblemDetails)
export function mensagemDeErro(error: unknown, padrao: string): string {
  if (!axios.isAxiosError(error) || !error.response) return padrao;

  const data = error.response.data;
  if (typeof data === "string" && data.trim()) return data;

  if (data?.errors) {
    const primeira = Object.values(data.errors as Record<string, string[]>)[0];
    if (primeira?.length) return primeira[0];
  }

  if (error.response.status === 403) return "Você não tem permissão para esta ação.";

  return data?.title ?? padrao;
}

export default api;
