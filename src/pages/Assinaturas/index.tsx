import { useEffect, useState } from 'react';
import { Spinner, Table, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaEdit, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';
import PageContentContainer from '../../components/PageContentContainer';

import AssinaturaService from '../../services/AssinaturaService';
import { mensagemDeErro } from '../../services/api';
import PlanoService from '../../services/PlanoService';

import { MainWrapper, TableContainer, ActionButton, FilterContainer } from './styles';

interface Assinatura {
    id: number;
    clienteNome: string;
    planoId: number;
    tipoRecorrencia: string;
    formaPagamento: string;
    dataInicio: string;
    dataExpiracao: string;
    status: string;
}

interface Plano {
    id: number;
    nome: string;
}

export function Assinaturas() {
    const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterPlanoId, setFilterPlanoId] = useState<number>(0);
    const [filterStatus, setFilterStatus] = useState<string>('Todos');

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAssinatura, setSelectedAssinatura] = useState<Assinatura | null>(null);
    const [editPlanoId, setEditPlanoId] = useState<number>(0);
    const [editCiclo, setEditCiclo] = useState('');
    const [editPagamento, setEditPagamento] = useState('');
    const [editStatus, setEditStatus] = useState(''); 

    useEffect(() => {
        async function loadData() {
            try {
                const [assData, planosData] = await Promise.all([
                    AssinaturaService.getAll(),
                    PlanoService.getAll()
                ]);
                setAssinaturas(assData);
                setPlanos(planosData);
            } catch {
                toast.error("Erro ao carregar dados.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    function handleOpenEdit(assinatura: Assinatura) {
        setSelectedAssinatura(assinatura);
        setEditPlanoId(assinatura.planoId);
        setEditCiclo(assinatura.tipoRecorrencia);
        setEditPagamento(assinatura.formaPagamento);
        setEditStatus(assinatura.status); 
        setShowEditModal(true);
    }

    async function handleSaveEdit() {
        if (!selectedAssinatura) return;

        try {            
            if (editStatus !== selectedAssinatura.status) {
                if (editStatus === 'Ativo') {
                    await AssinaturaService.reactivate(selectedAssinatura.id);
                } else {
                    await AssinaturaService.delete(selectedAssinatura.id);
                }
            }

            await AssinaturaService.update(selectedAssinatura.id, {
                planoId: editPlanoId,
                tipoRecorrencia: editCiclo,
                formaPagamento: editPagamento
            });

            toast.success("Alterações salvas com sucesso!");
            setShowEditModal(false);

            setAssinaturas(oldList => oldList.map(item =>
                item.id === selectedAssinatura.id
                    ? { ...item, planoId: editPlanoId, tipoRecorrencia: editCiclo, formaPagamento: editPagamento, status: editStatus }
                    : item
            ));

        } catch (error) {
            toast.error(mensagemDeErro(error, "Erro ao processar as alterações."));
        }
    }

    function getPlanoNome(id: number) {
        const plano = planos.find(p => p.id === id);
        return plano ? plano.nome : 'Plano Removido';
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const filteredAssinaturas = assinaturas.filter(a => {
        const matchPlano = filterPlanoId === 0 || a.planoId === filterPlanoId;
        const matchStatus = filterStatus === 'Todos' || a.status === filterStatus;
        return matchPlano && matchStatus;
    });

    return (
        <PageContainer>
            <Sidebar />
            <MainWrapper>
                <PageHeaderContainer title="Gestão de Assinaturas" icon={<FaFileInvoiceDollar />}>
                    <FilterContainer>
                        <Row className="g-2">
                            <Col md="auto">
                                <Form.Select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="Todos">Todos os Status</option>
                                    <option value="Ativo">Apenas Ativos</option>
                                    <option value="Inativo">Apenas Inativos</option>
                                </Form.Select>
                            </Col>
                            <Col md="auto">
                                <Form.Select
                                    value={filterPlanoId}
                                    onChange={(e) => setFilterPlanoId(Number(e.target.value))}
                                >
                                    <option value={0}>Todos os Planos</option>
                                    {planos.map(plano => (
                                        <option key={plano.id} value={plano.id}>{plano.nome}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </FilterContainer>
                </PageHeaderContainer>

                <PageContentContainer>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>
                    ) : (
                        <TableContainer>
                            <Table hover responsive className="m-0 align-middle">
                                <thead className="bg-light text-secondary">
                                    <tr>
                                        <th className="py-3 ps-4">Cliente / Plano</th>
                                        <th className="py-3">Ciclo & Pagamento</th>
                                        <th className="py-3">Vigência</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3 text-end pe-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssinaturas.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-5 text-muted">
                                                <FaFilter size={24} className="mb-2" /><br />
                                                Nenhum resultado para os filtros aplicados.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAssinaturas.map((item) => (
                                            <tr key={item.id}>
                                                <td className="ps-4">
                                                    <div className="fw-bold text-dark">{item.clienteNome}</div>
                                                    <small className="text-muted">Plano: {getPlanoNome(item.planoId)}</small>
                                                </td>
                                                <td>{item.tipoRecorrencia} <br /><small>{item.formaPagamento}</small></td>
                                                <td>{formatDate(item.dataInicio)} - <span className="text-danger">{formatDate(item.dataExpiracao)}</span></td>
                                                <td>
                                                    <Badge bg={item.status === 'Ativo' ? 'success' : 'secondary'} className="px-3 py-2" style={{ borderRadius: '30px' }}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <ActionButton $variant="edit" onClick={() => handleOpenEdit(item)} title="Editar"><FaEdit /></ActionButton>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </TableContainer>
                    )}
                </PageContentContainer>
            </MainWrapper>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary fw-bold">Gerenciar Assinatura</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Status da Assinatura</Form.Label>
                                    <Form.Select 
                                        value={editStatus} 
                                        onChange={e => setEditStatus(e.target.value)}
                                        className={editStatus === 'Ativo' ? 'text-success fw-bold' : 'text-danger fw-bold'}
                                    >
                                        <option value="Ativo">Ativo (Acesso Liberado)</option>
                                        <option value="Inativo">Inativo (Acesso Suspenso)</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr />
                        <Form.Group className="mb-3">
                            <Form.Label>Plano</Form.Label>
                            <Form.Select value={editPlanoId} onChange={e => setEditPlanoId(Number(e.target.value))}>
                                {planos.map(p => (<option key={p.id} value={p.id}>{p.nome}</option>))}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ciclo</Form.Label>
                                    <Form.Select value={editCiclo} onChange={e => setEditCiclo(e.target.value)}>
                                        <option value="Mensal">Mensal</option>
                                        <option value="Trimestral">Trimestral</option>
                                        <option value="Anual">Anual</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pagamento</Form.Label>
                                    <Form.Select value={editPagamento} onChange={e => setEditPagamento(e.target.value)}>
                                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                                        <option value="Pix">Pix</option>
                                        <option value="Boleto">Boleto</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }} onClick={handleSaveEdit}>Salvar Alterações</Button>
                </Modal.Footer>
            </Modal>
        </PageContainer>
    );
}