import { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { FaCheck, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

import AssinaturaService from '../../services/AssinaturaService';
import PlanoService from '../../services/PlanoService';
import ClienteService from '../../services/ClienteService';
import { mensagemDeErro } from '../../services/api';
import { ClienteFormModal } from '../ClienteFormModal';
import type { Plano } from '../../types/Plano';
import type { CicloDePreco } from '../../types/Cobranca';
import type { ClienteResumo } from '../../types/Cliente';

interface NovaAssinaturaModalProps {
  show: boolean;
  onHide: () => void;
  onCriada?: () => void;
  // Vindo da tela de Planos, o plano já está escolhido; vindo da ficha do cliente, o cliente já está escolhido
  planoInicial?: Plano | null;
  clienteInicial?: { id: number; nome: string } | null;
}

const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function NovaAssinaturaModal({ show, onHide, onCriada, planoInicial, clienteInicial }: NovaAssinaturaModalProps) {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [clientes, setClientes] = useState<ClienteResumo[]>([]);
  const [planoId, setPlanoId] = useState(0);
  const [clienteId, setClienteId] = useState(0);
  const [ciclo, setCiclo] = useState('Mensal');
  const [pagamento, setPagamento] = useState('Cartão de Crédito');
  const [ciclos, setCiclos] = useState<CicloDePreco[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [mostrarNovoCliente, setMostrarNovoCliente] = useState(false);

  useEffect(() => {
    if (!show) return;
    setPlanoId(planoInicial?.id ?? 0);
    setClienteId(clienteInicial?.id ?? 0);
    setCiclo('Mensal');
    setPagamento('Cartão de Crédito');

    if (!planoInicial) PlanoService.getAll().then(setPlanos).catch(() => setPlanos([]));
    if (!clienteInicial) ClienteService.getAll().then(setClientes).catch(() => setClientes([]));
  }, [show, planoInicial, clienteInicial]);

  useEffect(() => {
    if (!planoId) { setCiclos([]); return; }
    PlanoService.getCiclos(planoId).then(setCiclos).catch(() => setCiclos([]));
  }, [planoId]);

  const plano = planoInicial ?? planos.find(p => p.id === planoId);
  const cicloSelecionado = ciclos.find(c => c.recorrencia === ciclo);
  const mesesGratis = cicloSelecionado ? cicloSelecionado.meses - cicloSelecionado.mesesCobrados : 0;

  async function clienteCriado(id: number) {
    setMostrarNovoCliente(false);
    setClientes(await ClienteService.getAll());
    setClienteId(id);
  }

  async function confirmar() {
    if (!clienteId) { toast.warning('Escolha o cliente.'); return; }
    if (!planoId) { toast.warning('Escolha o plano.'); return; }

    setSalvando(true);
    try {
      await AssinaturaService.create({ clienteId, planoId, tipoRecorrencia: ciclo, formaPagamento: pagamento });
      toast.success(`Assinatura do plano ${plano?.nome} criada! A primeira cobrança já foi gerada.`);
      onCriada?.();
      onHide();
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao criar assinatura.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Modal show={show && !mostrarNovoCliente} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'var(--cor-primaria-escura)', fontWeight: 'bold' }}>Nova assinatura</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row>
            <Col md={5} className="mb-3 border-end d-flex flex-column justify-content-center text-center">
              {plano ? (
                <div className="p-3 bg-light rounded">
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--cor-primaria-escura)' }}>{plano.nome}</h4>
                  <h2 className="text-success my-2">{moeda(cicloSelecionado?.valor ?? plano.valor)}</h2>
                  <p className="text-muted small mb-2">
                    {cicloSelecionado && cicloSelecionado.meses > 1
                      ? `por ${cicloSelecionado.meses} meses · equivale a ${moeda(cicloSelecionado.valorMensalEquivalente)}/mês`
                      : 'por mês'}
                  </p>
                  {mesesGratis > 0 && <Badge bg="success">{mesesGratis} {mesesGratis === 1 ? 'mês grátis' : 'meses grátis'}</Badge>}
                  <p className="mt-3 text-muted small mb-0">{plano.descricao}</p>
                </div>
              ) : (
                <p className="text-muted">Escolha um plano para ver o preço de cada ciclo.</p>
              )}
            </Col>

            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Cliente</Form.Label>
                {clienteInicial ? (
                  <Form.Control value={clienteInicial.nome} disabled readOnly />
                ) : (
                  <div className="d-flex gap-2">
                    <Form.Select value={clienteId} onChange={e => setClienteId(Number(e.target.value))} aria-label="Cliente">
                      <option value={0}>Selecione o cliente...</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nome}{c.documentoMascarado ? ` · ${c.documentoMascarado}` : ''}</option>
                      ))}
                    </Form.Select>
                    <Button variant="outline-secondary" className="text-nowrap" onClick={() => setMostrarNovoCliente(true)}>
                      <FaPlus /> Novo
                    </Button>
                  </div>
                )}
              </Form.Group>

              {!planoInicial && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Plano</Form.Label>
                  <Form.Select value={planoId} onChange={e => setPlanoId(Number(e.target.value))} aria-label="Plano">
                    <option value={0}>Selecione o plano...</option>
                    {planos.filter(p => p.ativo).map(p => <option key={p.id} value={p.id}>{p.nome} · {moeda(p.valor)}/mês</option>)}
                  </Form.Select>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Ciclo de cobrança</Form.Label>
                <Form.Select value={ciclo} onChange={e => setCiclo(e.target.value)}>
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral (1 mês grátis)</option>
                  <option value="Anual">Anual (2 meses grátis)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-bold">Forma de pagamento</Form.Label>
                <div className="d-flex gap-2 flex-wrap">
                  {['Cartão de Crédito', 'Boleto', 'Pix'].map(tipo => (
                    <Button
                      key={tipo}
                      variant={pagamento === tipo ? 'success' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setPagamento(tipo)}
                    >
                      {tipo}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }} onClick={confirmar} disabled={salvando}>
            {salvando ? <Spinner animation="border" size="sm" /> : <><FaCheck className="me-2" />Confirmar assinatura</>}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cadastro rápido: fecha o modal de assinatura enquanto está aberto e volta com o cliente já selecionado */}
      <ClienteFormModal show={show && mostrarNovoCliente} onHide={() => setMostrarNovoCliente(false)} onSalvo={clienteCriado} />
    </>
  );
}
