import { useCallback, useEffect, useMemo, useState } from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import { FaAddressBook, FaPlus, FaEnvelope, FaEdit, FaTrash, FaIdCard, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';
import { ClienteFormModal } from '../../components/ClienteFormModal';
import { NovaAssinaturaModal } from '../../components/NovaAssinaturaModal';

import ClienteService from '../../services/ClienteService';
import AuthService from '../../services/AuthService';
import { mensagemDeErro } from '../../services/api';
import type { ClienteResumo, FichaCliente, SituacaoCliente } from '../../types/Cliente';

import { MainWrapper, BarraFiltros, ChipSituacao, GridClientes, Cartao, LinhaCliente, Etiqueta, Ficha } from './styles';

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const data = (iso?: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const iniciais = (nome: string) => nome.split(' ').filter(p => p.length > 2).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const SITUACOES: (SituacaoCliente | '')[] = ['', 'Em dia', 'A vencer', 'Inadimplente'];

export function Clientes() {
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [situacao, setSituacao] = useState<SituacaoCliente | ''>('');
  const [selecionadoId, setSelecionadoId] = useState<number | null>(null);
  const [ficha, setFicha] = useState<FichaCliente | null>(null);
  const [ehAdmin, setEhAdmin] = useState(false);

  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [assinarAberto, setAssinarAberto] = useState(false);

  const carregarLista = useCallback(async () => {
    try {
      const lista = await ClienteService.getAll({ busca: busca || undefined, situacao: situacao || undefined });
      setClientes(lista);
      setSelecionadoId(atual => (atual && lista.some(c => c.id === atual) ? atual : lista[0]?.id ?? null));
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao carregar clientes.'));
    } finally {
      setCarregando(false);
    }
  }, [busca, situacao]);

  const carregarFicha = useCallback(async (id: number) => {
    try {
      setFicha(await ClienteService.getFicha(id));
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao carregar a ficha do cliente.'));
    }
  }, []);

  // Busca com pequeno atraso, para não chamar a API a cada tecla
  useEffect(() => {
    const timer = setTimeout(carregarLista, 300);
    return () => clearTimeout(timer);
  }, [carregarLista]);

  useEffect(() => {
    if (selecionadoId) carregarFicha(selecionadoId);
    else setFicha(null);
  }, [selecionadoId, carregarFicha]);

  useEffect(() => {
    AuthService.getMe().then(u => setEhAdmin(u.cargo === 'Admin')).catch(() => setEhAdmin(false));
  }, []);

  async function atualizarTudo(id?: number) {
    await carregarLista();
    const alvo = id ?? selecionadoId;
    if (alvo) {
      setSelecionadoId(alvo);
      carregarFicha(alvo);
    }
  }

  async function enviarLembrete() {
    if (!ficha) return;
    try {
      const { message } = await ClienteService.enviarLembrete(ficha.id);
      toast.success(message);
      carregarFicha(ficha.id);
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao enviar lembrete.'));
    }
  }

  async function excluir() {
    if (!ficha || !window.confirm(`Excluir o cliente ${ficha.nome}?`)) return;
    try {
      await ClienteService.delete(ficha.id);
      toast.success('Cliente excluído.');
      setSelecionadoId(null);
      carregarLista();
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao excluir cliente.'));
    }
  }

  const dadosParaEdicao = useMemo(
    () => (ficha ? { nome: ficha.nome, email: ficha.email, documento: ficha.documento, telefone: ficha.telefone } : undefined),
    [ficha]
  );
  const clienteDaFicha = useMemo(() => (ficha ? { id: ficha.id, nome: ficha.nome } : null), [ficha]);

  const cobrancasEmAberto = ficha?.cobrancas.filter(c => c.status === 'Pendente' || c.status === 'Vencida').length ?? 0;

  return (
    <PageContainer>
      <Sidebar />
      <MainWrapper>
        <PageHeaderContainer title="Clientes" icon={<FaAddressBook />}>
          <Button variant="light" className="fw-bold" onClick={() => { setEditando(false); setFormAberto(true); }}>
            <FaPlus className="me-1" /> Novo cliente
          </Button>
        </PageHeaderContainer>

        <BarraFiltros>
          <Form.Control
            type="search"
            placeholder="Buscar por nome, e-mail ou CPF/CNPJ"
            aria-label="Buscar cliente"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          {SITUACOES.map(s => (
            <ChipSituacao key={s || 'todos'} type="button" $ativo={situacao === s} aria-pressed={situacao === s} onClick={() => setSituacao(s)}>
              {s === '' ? 'Todos' : s === 'Inadimplente' ? 'Inadimplentes' : s}
            </ChipSituacao>
          ))}
        </BarraFiltros>

        {carregando ? (
          <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>
        ) : (
          <GridClientes>
            <Cartao>
              <LinhaCliente as="div" className="cabecalho" $selecionado={false}>
                <span>Cliente</span><span className="col-opcional">MRR</span><span className="col-opcional">Em aberto</span><span>Situação</span>
              </LinhaCliente>
              {clientes.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">Nenhum cliente encontrado.</p>
              ) : clientes.map(c => (
                <LinhaCliente key={c.id} type="button" $selecionado={c.id === selecionadoId} onClick={() => setSelecionadoId(c.id)}>
                  <span>
                    <span className="nome">{c.nome}</span>
                    <small>{c.documentoMascarado || 'sem documento'}{!c.email && ' · sem e-mail'}</small>
                  </span>
                  <span className="col-opcional">{c.mrr ? moeda(c.mrr) : '—'}</span>
                  <span className="col-opcional" style={{ color: c.vencido ? '#c0392b' : undefined }}>{c.emAberto ? moeda(c.emAberto) : '—'}</span>
                  <span><Etiqueta $valor={c.situacao}>{c.situacao}</Etiqueta></span>
                </LinhaCliente>
              ))}
            </Cartao>

            {ficha && (
              <Ficha aria-label={`Ficha de ${ficha.nome}`}>
                <div className="topo">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar" aria-hidden="true">{iniciais(ficha.nome)}</div>
                    <div>
                      <h3>{ficha.nome}</h3>
                      <small className="text-muted">Cliente desde {data(ficha.dataCadastro)}</small>
                    </div>
                  </div>
                  <Etiqueta $valor={ficha.situacao}>{ficha.situacao}</Etiqueta>
                </div>

                <div className="metricas">
                  <div><span>MRR do cliente</span><strong>{ficha.mrr ? moeda(ficha.mrr) : '—'}</strong></div>
                  <div><span>Em aberto</span><strong style={{ color: ficha.vencido ? '#c0392b' : undefined }}>{ficha.emAberto ? moeda(ficha.emAberto) : '—'}</strong></div>
                  <div><span>Assinaturas ativas</span><strong>{ficha.assinaturasAtivas}</strong></div>
                </div>

                <h4>Contato</h4>
                <div className="contato">
                  <span><FaEnvelope /> E-mail</span>
                  <span>{ficha.email ?? <em className="text-warning">não cadastrado (não recebe lembretes)</em>}</span>
                  <span><FaIdCard /> {ficha.tipoDocumento ?? 'Documento'}</span>
                  <span>{ficha.documento ?? '—'}</span>
                  <span><FaPhone /> Telefone</span>
                  <span>{ficha.telefone ?? '—'}</span>
                </div>

                <h4>Assinaturas</h4>
                {ficha.assinaturas.length === 0 ? (
                  <p className="text-muted small mb-0">Nenhuma assinatura ainda.</p>
                ) : ficha.assinaturas.map(a => (
                  <div className="linha" key={a.id}>
                    <span>{a.planoNome} · {a.tipoRecorrencia}</span>
                    <small>{a.status === 'Ativo' ? `renova em ${data(a.dataExpiracao)}` : 'encerrada'}</small>
                    <Etiqueta $valor={a.status}>{a.status === 'Ativo' ? 'Ativa' : 'Inativa'}</Etiqueta>
                  </div>
                ))}

                <h4>Histórico de cobranças</h4>
                {ficha.cobrancas.length === 0 ? (
                  <p className="text-muted small mb-0">Nenhuma cobrança.</p>
                ) : ficha.cobrancas.slice(0, 6).map(c => (
                  <div className="linha" key={c.id}>
                    <span>Vencimento {data(c.dataVencimento)}<br /><small>{c.planoNome}</small></span>
                    <span>{moeda(c.valor)}{c.status === 'Vencida' && <><br /><small className="text-danger">{c.diasEmAtraso} dia(s) em atraso</small></>}</span>
                    <Etiqueta $valor={c.status}>{c.status}</Etiqueta>
                  </div>
                ))}
                {ficha.cobrancas.length > 6 && <small className="text-muted">e mais {ficha.cobrancas.length - 6} cobrança(s) na aba Cobranças</small>}

                <div className="acoes">
                  <Button size="sm" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }} onClick={() => setAssinarAberto(true)}>
                    <FaPlus className="me-1" /> Nova assinatura
                  </Button>
                  {ficha.email && cobrancasEmAberto > 0 && (
                    <Button size="sm" variant="outline-secondary" onClick={enviarLembrete}>
                      <FaEnvelope className="me-1" /> Enviar lembrete
                    </Button>
                  )}
                  <Button size="sm" variant="outline-secondary" onClick={() => { setEditando(true); setFormAberto(true); }}>
                    <FaEdit className="me-1" /> Editar dados
                  </Button>
                  {ehAdmin && ficha.assinaturas.length === 0 && (
                    <Button size="sm" variant="outline-danger" onClick={excluir}>
                      <FaTrash className="me-1" /> Excluir
                    </Button>
                  )}
                </div>
              </Ficha>
            )}
          </GridClientes>
        )}
      </MainWrapper>

      <ClienteFormModal
        show={formAberto}
        onHide={() => setFormAberto(false)}
        clienteId={editando ? ficha?.id : undefined}
        dadosIniciais={editando ? dadosParaEdicao : undefined}
        onSalvo={(id) => { setFormAberto(false); atualizarTudo(id); }}
      />

      <NovaAssinaturaModal
        show={assinarAberto}
        onHide={() => setAssinarAberto(false)}
        clienteInicial={clienteDaFicha}
        onCriada={() => atualizarTudo()}
      />
    </PageContainer>
  );
}
