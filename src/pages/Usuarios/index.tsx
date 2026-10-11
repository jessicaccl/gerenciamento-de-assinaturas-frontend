import { useState, useEffect } from 'react';
import { Table, Spinner, Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { AiOutlineIdcard, AiOutlineUser, AiOutlineMail } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';

import UsuarioService from '../../services/UsuarioService';
import { mensagemDeErro } from '../../services/api';
import type { Usuario } from '../../types/Usuario';

import {
  MainWrapper,
  TableContainer,
  StatusBadge,
  ActionButton
} from './styles';

export function Usuarios() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [saving, setSaving] = useState(false);

  const [editNome, setEditNome] = useState('');
  const [editEmail, setEditEmail] = useState('');

  async function loadUsuarios() {
    try {
      setLoading(true);
      const data = await UsuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  }

  function handleEditClick(user: Usuario) {
    setSelectedUser(user);
    setEditNome(user.nome);
    setEditEmail(user.email);
    setShowEditModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedUser && selectedUser.id) {
        await UsuarioService.update(selectedUser.id, {
          id: selectedUser.id,
          nome: editNome,
          email: editEmail
        });

        toast.success(`Dados atualizados com sucesso!`);
        setShowEditModal(false);
        loadUsuarios();
      }
    } catch (error) {
      toast.error(mensagemDeErro(error, "Erro ao salvar alterações."));
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  return (
    <PageContainer>
      <Sidebar />

      <MainWrapper>
        <PageHeaderContainer
          title="Base de Usuários"
          icon={<AiOutlineIdcard />}
        />

        <TableContainer>
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Carregando dados...</p>
            </div>
          ) : (
            <Table hover responsive borderless className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cadastro</th>
                  <th>Cargo</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      Nenhum usuário encontrado na base de dados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td><strong>{user.nome}</strong></td>
                      <td>{user.email}</td>
                      <td>{user.dataCriacao ? new Date(user.dataCriacao).toLocaleDateString('pt-BR') : '---'}</td>
                      <td>
                        <StatusBadge $ativo={true}>
                          {user.cargo || 'Colaborador'}
                        </StatusBadge>
                      </td>

                      <td className="text-center">
                        <ActionButton
                          $variant="edit"
                          title="Editar Dados"
                          onClick={() => handleEditClick(user)}
                        >
                          <FaEdit />
                        </ActionButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </MainWrapper>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>
            Editar Dados
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <InputGroup>
                <InputGroup.Text><AiOutlineUser /></InputGroup.Text>
                <Form.Control
                  value={editNome}
                  onChange={e => setEditNome(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>E-mail</Form.Label>
              <InputGroup>
                <InputGroup.Text><AiOutlineMail /></InputGroup.Text>
                <Form.Control
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }}
                disabled={saving}
              >
                {saving ? <Spinner animation="border" size="sm" /> : "Salvar Alterações"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </PageContainer>
  );
}