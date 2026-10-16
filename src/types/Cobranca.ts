export type StatusCobranca = 'Pendente' | 'Vencida' | 'Paga' | 'Cancelada';

export interface Cobranca {
  id: number;
  assinaturaId: number;
  clienteNome: string;
  planoNome: string;
  tipoRecorrencia: string;
  periodoInicio: string;
  periodoFim: string;
  dataVencimento: string;
  valor: number;
  status: StatusCobranca;
  dataPagamento?: string | null;
  formaPagamento?: string | null;
  diasEmAtraso: number;
}

export interface CicloDePreco {
  recorrencia: string;
  meses: number;
  mesesCobrados: number;
  valor: number;
  valorMensalEquivalente: number;
  percentualDesconto: number;
}
