export interface FaixaDeAging {
  faixa: string;
  percentualDeRisco: number;
  valor: number;
  quantidade: number;
  provisao: number;
}

export interface PrevisaoMensal {
  mes: string; // yyyy-MM
  recebido: number;
  previsto: number;
  emRisco: number;
}

export interface ProximoVencimento {
  cobrancaId: number;
  clienteNome: string;
  planoNome: string;
  dataVencimento: string;
  valor: number;
}

export interface PainelDeProvisoes {
  dataReferencia: string;
  mrr: number;
  assinaturasAtivas: number;
  ticketMedio: number;
  aReceber30Dias: number;
  quantidadeAReceber30Dias: number;
  vencido: number;
  quantidadeVencida: number;
  provisaoInadimplencia: number;
  percentualProvisionado: number;
  recebidoMesAtual: number;
  aging: FaixaDeAging[];
  previsao: PrevisaoMensal[];
  proximosVencimentos: ProximoVencimento[];
}
