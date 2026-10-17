import { useEffect, useState } from 'react';
import { Modal, Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

import ClienteService from '../../services/ClienteService';
import { mensagemDeErro } from '../../services/api';
import type { SalvarCliente } from '../../types/Cliente';

interface ClienteFormModalProps {
  show: boolean;
  onHide: () => void;
  // Recebe o id do cliente salvo (útil para já selecionar o cliente recém-criado)
  onSalvo: (id: number) => void;
  clienteId?: number;
  dadosIniciais?: SalvarCliente;
}

const VAZIO: SalvarCliente = { nome: '', email: '', documento: '', telefone: '' };

// Formata enquanto digita: até 11 dígitos vira CPF, acima disso CNPJ
function mascararDocumento(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function mascararTelefone(valor: string) {
  const d = valor.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

export function ClienteFormModal({ show, onHide, onSalvo, clienteId, dadosIniciais }: ClienteFormModalProps) {
  const [dados, setDados] = useState<SalvarCliente>(VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [erroNome, setErroNome] = useState('');

  useEffect(() => {
    if (show) {
      setDados({ ...VAZIO, ...dadosIniciais });
      setErroNome('');
    }
  }, [show, dadosIniciais]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!dados.nome.trim()) {
      setErroNome('Informe o nome do cliente.');
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        nome: dados.nome,
        email: dados.email || null,
        documento: dados.documento || null,
        telefone: dados.telefone || null,
      };

      if (clienteId) {
        await ClienteService.update(clienteId, payload);
        toast.success('Cliente atualizado!');
        onSalvo(clienteId);
      } else {
        const { id } = await ClienteService.create(payload);
        toast.success('Cliente cadastrado!');
        onSalvo(id);
      }
    } catch (error) {
      toast.error(mensagemDeErro(error, 'Erro ao salvar cliente.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={salvar} noValidate>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'var(--cor-primaria-escura)', fontWeight: 'bold' }}>
            {clienteId ? 'Editar cliente' : 'Novo cliente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome ou razão social</Form.Label>
            <Form.Control
              value={dados.nome}
              isInvalid={!!erroNome}
              onChange={e => { setDados({ ...dados, nome: e.target.value }); setErroNome(''); }}
              placeholder="Ex.: Padaria Pão Quente"
              autoFocus
            />
            <Form.Control.Feedback type="invalid">{erroNome}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>E-mail <small className="text-muted">(para lembretes de cobrança)</small></Form.Label>
            <Form.Control
              type="email"
              value={dados.email ?? ''}
              onChange={e => setDados({ ...dados, email: e.target.value })}
              placeholder="financeiro@empresa.com"
            />
          </Form.Group>

          <Row>
            <Col sm={7}>
              <Form.Group className="mb-3">
                <Form.Label>CPF ou CNPJ <small className="text-muted">(opcional)</small></Form.Label>
                <Form.Control
                  value={dados.documento ?? ''}
                  onChange={e => setDados({ ...dados, documento: mascararDocumento(e.target.value) })}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </Form.Group>
            </Col>
            <Col sm={5}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  value={dados.telefone ?? ''}
                  onChange={e => setDados({ ...dados, telefone: mascararTelefone(e.target.value) })}
                  placeholder="(11) 90000-0000"
                  inputMode="tel"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" style={{ backgroundColor: 'var(--cor-primaria)', border: 'none' }} disabled={salvando}>
            {salvando ? <Spinner animation="border" size="sm" /> : 'Salvar cliente'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
