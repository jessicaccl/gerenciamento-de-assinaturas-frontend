import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaCoins, FaExclamationTriangle, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';

import ProvisaoService from '../../services/ProvisaoService';
import { mensagemDeErro } from '../../services/api';
import type { PainelDeProvisoes } from '../../types/Provisoes';

import {
  MainWrapper, GridMetricas, CardMetrica, GridPaineis, Painel, SeletorPeriodo, FaixaAging, ListaVencimentos
} from './styles';

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const moedaCurta = (valor: number) =>
  valor >= 1000 ? `R$ ${(valor / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil` : `R$ ${Math.round(valor)}`;
const data = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/');

const NOMES_MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const nomeDoMes = (anoMes: string) => {
  const [ano, mes] = anoMes.split('-');
  return `${NOMES_MESES[Number(mes) - 1]}/${ano.slice(2)}`;
};

const CORES = { recebido: '#10B981', previsto: '#C4B5FD', emRisco: '#E24B4A' };

export function Dashboard() {
  const navigate = useNavigate();
  const [painel, setPainel] = useState<PainelDeProvisoes | null>(null);
  const [mesesFuturos, setMesesFuturos] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        setPainel(await ProvisaoService.getPainel(mesesFuturos));
      } catch (error) {
        toast.error(mensagemDeErro(error, 'Não foi possível carregar o painel.'));
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [mesesFuturos]);

  const maiorFaixa = painel ? Math.max(...painel.aging.map(f => f.valor), 1) : 1;
  const dadosGrafico = painel?.previsao.map(p => ({ ...p, nome: nomeDoMes(p.mes) })) ?? [];

  return (
    <PageContainer>
      <Sidebar />

      <MainWrapper>
        <PageHeaderContainer title="Provisões de pagamento" icon={<FaChartLine />} />

        {loading && !painel ? (
          <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>
        ) : painel && (
          <>
            <GridMetricas>
              <CardMetrica>
                <span className="rotulo"><FaChartLine /> MRR (receita recorrente mensal)</span>
                <div className="valor">{moeda(painel.mrr)}</div>
                <span className="detalhe">{painel.assinaturasAtivas} assinaturas ativas · ticket médio {moeda(painel.ticketMedio)}</span>
              </CardMetrica>

              <CardMetrica $cor="var(--cor-primaria)">
                <span className="rotulo"><FaCoins /> A receber (30 dias)</span>
                <div className="valor">{moeda(painel.aReceber30Dias)}</div>
                <span className="detalhe">{painel.quantidadeAReceber30Dias} cobranças, incluindo próximos ciclos</span>
              </CardMetrica>

              <CardMetrica $cor="#c0392b">
                <span className="rotulo"><FaExclamationTriangle /> Vencido</span>
                <div className="valor">{moeda(painel.vencido)}</div>
                <span className="detalhe">{painel.quantidadeVencida} cobranças em atraso</span>
              </CardMetrica>

              <CardMetrica $cor="#b45309">
                <span className="rotulo"><FaShieldAlt /> Provisão para inadimplência</span>
                <div className="valor">{moeda(painel.provisaoInadimplencia)}</div>
                <span className="detalhe">{painel.percentualProvisionado.toLocaleString('pt-BR')}% do valor vencido</span>
              </CardMetrica>
            </GridMetricas>

            <GridPaineis>
              <Painel>
                <header>
                  <h3>Previsão de recebimentos</h3>
                  <SeletorPeriodo role="group" aria-label="Período da previsão">
                    {[3, 6, 12].map(meses => (
                      <button
                        key={meses}
                        type="button"
                        className={mesesFuturos === meses ? 'ativo' : ''}
                        aria-pressed={mesesFuturos === meses}
                        onClick={() => setMesesFuturos(meses)}
                      >
                        {meses} meses
                      </button>
                    ))}
                  </SeletorPeriodo>
                </header>

                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={dadosGrafico} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="nome" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={moedaCurta} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                      <Tooltip formatter={(valor) => moeda(Number(valor))} cursor={{ fill: 'rgba(109, 40, 217, 0.06)' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
                      <Bar dataKey="recebido" name="Recebido" stackId="mes" fill={CORES.recebido} />
                      <Bar dataKey="previsto" name="Previsto" stackId="mes" fill={CORES.previsto} />
                      <Bar dataKey="emRisco" name="Em risco (vencido)" stackId="mes" fill={CORES.emRisco} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Painel>

              <Painel>
                <header>
                  <h3>Aging da inadimplência</h3>
                </header>
                {painel.aging.map(faixa => (
                  <FaixaAging
                    key={faixa.faixa}
                    $percentual={Math.round((faixa.valor / maiorFaixa) * 100)}
                    $cor={faixa.percentualDeRisco >= 80 ? CORES.emRisco : '#EF9F27'}
                  >
                    <div className="linha">
                      <span>{faixa.faixa} <small>· {faixa.quantidade} cobrança(s) · {faixa.percentualDeRisco}% de risco</small></span>
                      <strong>{moeda(faixa.valor)}</strong>
                    </div>
                    <div className="barra"><div /></div>
                  </FaixaAging>
                ))}
                <small className="text-muted">Provisão = valor em atraso × percentual de risco da faixa</small>
              </Painel>
            </GridPaineis>

            <GridPaineis>
              <Painel>
                <header>
                  <h3><FaCalendarAlt className="me-2" />Próximos vencimentos</h3>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/cobrancas')}>
                    Ver todas as cobranças
                  </button>
                </header>
                {painel.proximosVencimentos.length === 0 ? (
                  <p className="vazio">Nenhuma cobrança em aberto.</p>
                ) : (
                  <ListaVencimentos>
                    {painel.proximosVencimentos.map(v => (
                      <li key={v.cobrancaId}>
                        <div>
                          <strong>{v.clienteNome}</strong>
                          <small>{v.planoNome} · vence em {data(v.dataVencimento)}</small>
                        </div>
                        <span className="valor">{moeda(v.valor)}</span>
                      </li>
                    ))}
                  </ListaVencimentos>
                )}
              </Painel>

              <Painel>
                <header>
                  <h3>Recebido no mês</h3>
                </header>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: CORES.recebido }}>{moeda(painel.recebidoMesAtual)}</div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.9rem' }}>
                  Pagamentos registrados desde o dia 1º. Cobranças vencidas entram na provisão até serem pagas ou canceladas.
                </p>
              </Painel>
            </GridPaineis>
          </>
        )}
      </MainWrapper>
    </PageContainer>
  );
}
