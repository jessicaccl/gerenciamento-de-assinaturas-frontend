import { useEffect, useMemo, useState } from 'react';
import { Spinner, Table, Modal, Form, Button } from 'react-bootstrap';
import { FaReceipt, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';
import PageContentContainer from '../../components/PageContentContainer';

import CobrancaService from '../../services/CobrancaService';
import AuthService from '../../services/AuthService';
import { mensagemDeErro } from '../../services/api';
import type { Cobranca, StatusCobranca } from '../../types/Cobranca';

import {
    MainWrapper, TableContainer, FilterContainer, ResumoGrid, ResumoCard, StatusBadge, BotaoAcao
} from './styles';

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// A API devolve datas sem fuso (yyyy-mm-ddThh:mm:ss); usar só a parte da data evita deslocamento de um dia
const data = (iso?: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '-');
const hojeIso = () => new Date().toLocaleDateString('sv-SE'); // yyyy-mm-dd no fuso local

export function Cobrancas() {
    const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<StatusCobranca | ''>('');
    const [ehAdmin, setEhAdmin] = useState(false);

    const [cobrancaSelecionada, setCobrancaSelecionada] = useState<Cobranca | null>(null);
    const [dataPagamento, setDataPagamento] = useState(hojeIso());
    const [formaPagamento, setFormaPagamento] = useState('Pix');
    const [salvando, setSalvando] = useState(false);

    async function carregar() {
        try {
            setLoading(true);
            setCobrancas(await CobrancaService.getAll());
        } catch (error) {
            toast.error(mensagemDeErro(error, 'Erro ao carregar cobranças.'));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
        AuthService.getMe()
            .then(user => setEhAdmin(user.cargo === 'Admin'))
            .catch(() => setEhAdmin(false));
    }, []);

    const resumo = useMemo(() => {
        const soma = (lista: Cobranca[]) => lista.reduce((total, c) => total + c.valor, 0);
        const pendentes = cobrancas.filter(c => c.status === 'Pendente');
        const vencidas = cobrancas.filter(c => c.status === 'Vencida');
        const limite = new Date();
        limite.setDate(limite.getDate() - 30);
        const pagas30 = cobrancas.filter(c => c.status === 'Paga' && c.dataPagamento && new Date(c.dataPagamento) >= limite);

        return {
            aReceber: soma(pendentes), qtdAReceber: pendentes.length,
            vencido: soma(vencidas), qtdVencido: vencidas.length,
            recebido: soma(pagas30), qtdRecebido: pagas30.length,
        };
    }, [cobrancas]);

    const filtradas = filtroStatus ? cobrancas.filter(c => c.status === filtroStatus) : cobrancas;

    function abrirPagamento(cobranca: Cobranca) {
        setCobrancaSelecionada(cobranca);
        setDataPagamento(hojeIso());
        setFormaPagamento(cobranca.formaPagamento ?? 'Pix');
    }

    async function confirmarPagamento() {
        if (!cobrancaSelecionada) return;
        if (!dataPagamento) {
            toast.warning('Informe a data do pagamento.');
            return;
        }

        setSalvando(true);
        try {
            await CobrancaService.registrarPagamento(cobrancaSelecionada.id, dataPagamento, formaPagamento);
            toast.success('Pagamento registrado!');
            setCobrancaSelecionada(null);
            carregar();
        } catch (error) {
            toast.error(mensagemDeErro(error, 'Erro ao registrar pagamento.'));
        } finally {
            setSalvando(false);
        }
    }

    async function cancelar(cobranca: Cobranca) {
        if (!window.confirm(`Cancelar a cobrança de ${moeda(cobranca.valor)} de ${cobranca.clienteNome}?`)) return;

        try {
            await CobrancaService.cancelar(cobranca.id);
            toast.success('Cobrança cancelada.');
            carregar();
        } catch (error) {
            toast.error(mensagemDeErro(error, 'Erro ao cancelar cobrança.'));
        }
    }

    return (
        <PageContainer>
            <Sidebar />
            <MainWrapper>
                <PageHeaderContainer title="Cobranças" icon={<FaReceipt />}>
                    <FilterContainer>
                        <Form.Select
                            aria-label="Filtrar por status"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value as StatusCobranca | '')}
                        >
                            <option value="">Todos os status</option>
                            <option value="Pendente">Pendentes</option>
                            <option value="Vencida">Vencidas</option>
                            <option value="Paga">Pagas</option>
                            <option value="Cancelada">Canceladas</option>
                        </Form.Select>
                    </FilterContainer>
                </PageHeaderContainer>

                <PageContentContainer>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>
                    ) : (
                        <>
                            <ResumoGrid>
                                <ResumoCard $cor="var(--cor-primaria)">
                                    <span>A receber</span>
                                    <strong>{moeda(resumo.aReceber)}</strong>
                                    <small>{resumo.qtdAReceber} cobrança(s) em aberto</small>
                                </ResumoCard>
                                <ResumoCard $cor="#c0392b">
                                    <span>Vencido</span>
                                    <strong>{moeda(resumo.vencido)}</strong>
                                    <small>{resumo.qtdVencido} cobrança(s) em atraso</small>
                                </ResumoCard>
                                <ResumoCard $cor="var(--cor-destaque)">
                                    <span>Recebido (últimos 30 dias)</span>
                                    <strong>{moeda(resumo.recebido)}</strong>
                                    <small>{resumo.qtdRecebido} pagamento(s)</small>
                                </ResumoCard>
                            </ResumoGrid>

                            <TableContainer>
                                <Table hover responsive className="m-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th className="ps-3">Cliente / Plano</th>
                                            <th>Período</th>
                                            <th>Vencimento</th>
                                            <th>Valor</th>
                                            <th>Status</th>
                                            <th className="text-end pe-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtradas.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-5 text-muted">
                                                    <FaFilter size={24} className="mb-2" /><br />
                                                    Nenhuma cobrança encontrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtradas.map(c => {
                                                const emAberto = c.status === 'Pendente' || c.status === 'Vencida';
                                                return (
                                                    <tr key={c.id}>
                                                        <td className="ps-3">
                                                            <div className="fw-bold text-dark">{c.clienteNome}</div>
                                                            <small className="text-muted">{c.planoNome} · {c.tipoRecorrencia}</small>
                                                        </td>
                                                        <td><small>{data(c.periodoInicio)} a {data(c.periodoFim)}</small></td>
                                                        <td>
                                                            {data(c.dataVencimento)}
                                                            {c.status === 'Vencida' && (
                                                                <div><small className="text-danger">{c.diasEmAtraso} dia(s) em atraso</small></div>
                                                            )}
                                                            {c.status === 'Paga' && (
                                                                <div><small className="text-muted">pago em {data(c.dataPagamento)}</small></div>
                                                            )}
                                                        </td>
                                                        <td className="fw-bold">{moeda(c.valor)}</td>
                                                        <td><StatusBadge $status={c.status}>{c.status}</StatusBadge></td>
                                                        <td className="text-end pe-3 text-nowrap">
                                                            {emAberto && (
                                                                <BotaoAcao $variante="pagar" onClick={() => abrirPagamento(c)}>Registrar pagamento</BotaoAcao>
                                                            )}
                                                            {emAberto && ehAdmin && (
                                                                <BotaoAcao $variante="cancelar" onClick={() => cancelar(c)}>Cancelar</BotaoAcao>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </PageContentContainer>
            </MainWrapper>

            <Modal show={cobrancaSelecionada !== null} onHide={() => setCobrancaSelecionada(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'var(--cor-primaria-escura)', fontWeight: 'bold' }}>Registrar pagamento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cobrancaSelecionada && (
                        <p className="mb-4">
                            <strong>{cobrancaSelecionada.clienteNome}</strong> · {cobrancaSelecionada.planoNome}<br />
                            <span className="text-muted">Valor: </span><strong>{moeda(cobrancaSelecionada.valor)}</strong>
                            <span className="text-muted"> · vencimento {data(cobrancaSelecionada.dataVencimento)}</span>
                        </p>
                    )}
                    <Form.Group className="mb-3">
                        <Form.Label>Data do pagamento</Form.Label>
                        <Form.Control type="date" value={dataPagamento} max={hojeIso()} onChange={e => setDataPagamento(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Forma de pagamento</Form.Label>
                        <Form.Select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                            <option value="Pix">Pix</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Boleto">Boleto</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCobrancaSelecionada(null)}>Voltar</Button>
                    <Button style={{ backgroundColor: 'var(--cor-destaque)', border: 'none' }} onClick={confirmarPagamento} disabled={salvando}>
                        {salvando ? <Spinner animation="border" size="sm" /> : 'Confirmar pagamento'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </PageContainer>
    );
}
