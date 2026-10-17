import type { Cobranca } from './Cobranca';

export type SituacaoCliente = 'Em dia' | 'A vencer' | 'Inadimplente';

export interface ClienteResumo {
  id: number;
  nome: string;
  email?: string | null;
  tipoDocumento?: 'CPF' | 'CNPJ' | null;
  documentoMascarado: string;
  telefone?: string | null;
  dataCadastro: string;
  mrr: number;
  emAberto: number;
  vencido: number;
  assinaturasAtivas: number;
  situacao: SituacaoCliente;
}

export interface AssinaturaDoCliente {
  id: number;
  planoNome: string;
  tipoRecorrencia: string;
  formaPagamento: string;
  status: string;
  dataInicio: string;
  dataExpiracao?: string | null;
}

export interface FichaCliente extends ClienteResumo {
  documento?: string | null;
  assinaturas: AssinaturaDoCliente[];
  cobrancas: Cobranca[];
}

export interface SalvarCliente {
  nome: string;
  email?: string | null;
  documento?: string | null;
  telefone?: string | null;
}
