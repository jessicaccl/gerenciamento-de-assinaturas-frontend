import { useEffect, useState } from 'react';
import { Button, Spinner, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import { AiOutlineTable } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import { NovaAssinaturaModal } from '../../components/NovaAssinaturaModal';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';
import PageContentContainer from '../../components/PageContentContainer';

import PlanoService from '../../services/PlanoService';
import AuthService from '../../services/AuthService';
import { mensagemDeErro } from '../../services/api';
import type { Plano } from '../../types/Plano';

import {
  MainWrapper, GridPlanos, CardPlano, ButtonNew, ActionButton, ButtonSubscribe
} from './styles';

export function Planos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [ehAdmin, setEhAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingPlanoId, setEditingPlanoId] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDeleteId, setPlanToDeleteId] = useState<number | null>(null);
  const [deletePassword, setDeletePassword] = useState('');

  const [planoParaAssinar, setPlanoParaAssinar] = useState<Plano | null>(null);

  async function loadPlanos() {
    try {
      const data = await PlanoService.getAll();
      setPlanos(data);
    } catch {
      toast.error("Erro ao carregar planos.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingPlanoId(null);
    setNome('');
    setValor('');
    setDescricao('');
    setShowModal(true);
  }

  function handleOpenEdit(plano: Plano) {
    setEditingPlanoId(plano.id);
    setNome(plano.nome);
    setValor(plano.valor.toString());
    setDescricao(plano.descricao);
    setShowModal(true);
  }

  async function handleSalvarPlano() {
    if (!nome || !valor || !descricao) {
      toast.warning("Preencha todos os campos!");
      return;
    }
    setLoadingSave(true);

    try {
      const payload = {
        nome,
        valor: parseFloat(valor.replace(',', '.')),
        descricao,
        ativo: true
      };

      if (editingPlanoId) {

        await PlanoService.update(editingPlanoId, payload);
        toast.success("Plano atualizado com sucesso!");
      } else {

        await PlanoService.create(payload);
        toast.success("Plano criado com sucesso!");
      }

      setShowModal(false);
      loadPlanos();

    } catch (error) {
      toast.error(mensagemDeErro(error, "Erro ao salvar plano."));
    } finally {
      setLoadingSave(false);
    }
  }

  function handleDeleteTrigger(id: number) {
    setPlanToDeleteId(id);
    setDeletePassword('');
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    if (planToDeleteId === null) return;

    try {
      await PlanoService.delete(planToDeleteId, deletePassword);
      toast.success("Plano removido com segurança!");
      setShowDeleteModal(false);
      loadPlanos();
      setDeletePassword('');

    } catch (error) {
      toast.error(mensagemDeErro(error, "Erro ao excluir. Verifique a senha."));
    }
  }


  useEffect(() => {
    loadPlanos();
    AuthService.getMe()
      .then(user => setEhAdmin(user.cargo === 'Admin'))
      .catch(() => setEhAdmin(false));
  }, []);

  return (
    <PageContainer>
      <Sidebar />
      <MainWrapper>
        <PageHeaderContainer title="Planos Disponíveis" icon={<AiOutlineTable />}>
          {ehAdmin && (
            <ButtonNew onClick={handleOpenCreate}>
              <FaPlus /> Novo Plano
            </ButtonNew>
          )}
        </PageHeaderContainer>

        <PageContentContainer>
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : (
            <GridPlanos>
              {planos.map(plano => (
                <CardPlano key={plano.id}>
                  <header>
                    <div className="d-flex justify-content-between align-items-start">
                      <h3>{plano.nome}</h3>

                      {ehAdmin && (
                        <div className="d-flex gap-2">
                          <ActionButton
                            $variant="edit"
                            onClick={() => handleOpenEdit(plano)}
                            title="Editar Plano"
                          >
                            <FaEdit />
                          </ActionButton>
                          <ActionButton
                            $variant="delete"
                            onClick={() => handleDeleteTrigger(plano.id)}
                            title="Excluir Plano"
                          >
                            <FaTrash />
                          </ActionButton>
                        </div>
                      )}
                    </div>

                    <div className="price">
                      R$ {plano.valor.toFixed(2).replace('.', ',')}
                      <span>/mês</span>
                    </div>
                  </header>

                  <p>{plano.descricao}</p>

                  <ButtonSubscribe onClick={() => setPlanoParaAssinar(plano)}>
                    Assinar Plano
                  </ButtonSubscribe>
                </CardPlano>
              ))}
            </GridPlanos>
          )}
        </PageContentContainer>
      </MainWrapper>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'var(--cor-primaria-escura)' }}>
            {editingPlanoId ? 'Editar Plano' : 'Novo Plano'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Plano</Form.Label>
              <Form.Control
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Plano Gold"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor Mensal (R$)</Form.Label>
              <Form.Control
                type="number"
                value={valor}
                onChange={e => setValor(e.target.value)}
                placeholder="0.00"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição / Benefícios</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descreva os benefícios..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button
            style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
            onClick={handleSalvarPlano}
            disabled={loadingSave}
          >
            {loadingSave ? <Spinner animation="border" size="sm" /> : (editingPlanoId ? 'Salvar Alterações' : 'Criar Plano')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <Modal.Title style={{ color: '#d9534f', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaExclamationTriangle /> Zona de Perigo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">Esta ação excluirá o plano permanentemente. Confirme sua senha de administrador.</p>
          <Form.Group>
            <Form.Control
              type="password"
              placeholder="Senha de Admin"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none' }}>
          <Button variant="light" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirmar Exclusão</Button>
        </Modal.Footer>
      </Modal>

      <NovaAssinaturaModal
        show={planoParaAssinar !== null}
        planoInicial={planoParaAssinar}
        onHide={() => setPlanoParaAssinar(null)}
      />

    </PageContainer>
  );
}