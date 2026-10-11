import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { AiOutlineIdcard, AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';

import slide1 from '../../assets/images/slide-assinaturas.svg';
import slide2 from '../../assets/images/slide-seguranca.svg';
import slide3 from '../../assets/images/slide-gestao.svg';
import slide4 from '../../assets/images/slide-agilidade.svg';

import {
    Container,
    CarouselSection,
    BackgroundImage,
    BrandOverlay,
    CarouselContent,
    Indicators,
    FormSection,
    FormCard
} from './styles';

import logoImg from '../../assets/images/logo.svg';
import logoWhiteImg from '../../assets/images/logo-branco.svg';
import AuthService from '../../services/AuthService';
import { mensagemDeErro } from '../../services/api';

// Usuário criado pelo script de seed do backend (db/init.sql), para quem quiser testar sem se cadastrar
const CONTA_DEMO = { email: 'demo@assinamais.dev', senha: 'demo123' };

const slides = [
    {
        id: 1,
        image: slide1,
        title: "Assinaturas sob controle",
        description: "Planos, clientes e ciclos de cobrança em um só lugar."
    },
    {
        id: 2,
        image: slide2,
        title: "Segurança em primeiro lugar",
        description: "Autenticação JWT, senhas com hash e confirmação para ações críticas."
    },
    {
        id: 3,
        image: slide3,
        title: "Visão do negócio",
        description: "Acompanhe receita recorrente e assinaturas ativas no dashboard."
    },
    {
        id: 4,
        image: slide4,
        title: "Processos automáticos",
        description: "Eventos assíncronos com RabbitMQ e e-mail de boas-vindas."
    }
];

export function Login() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [regNome, setRegNome] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regSenha, setRegSenha] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    async function entrar(emailLogin: string, senhaLogin: string) {
        setLoading(true);
        // No plano gratuito a API "dorme" após um tempo sem uso; avisa se a primeira resposta demorar
        const avisoServidor = setTimeout(() => {
            toast.info("O servidor gratuito está acordando. Isso pode levar até 1 minuto na primeira vez.", { autoClose: 8000 });
        }, 5000);
        try {
            const data = await AuthService.login({ Email: emailLogin, Senha: senhaLogin });
            localStorage.setItem('user_token', data.token);
            toast.success("Login realizado com sucesso!");
            navigate('/home');
        } catch (error) {
            toast.error(mensagemDeErro(error, "Erro ao conectar com o servidor."));
        } finally {
            clearTimeout(avisoServidor);
            setLoading(false);
        }
    }

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        entrar(email, senha);
    }

    function handleDemo() {
        setEmail(CONTA_DEMO.email);
        setSenha(CONTA_DEMO.senha);
        entrar(CONTA_DEMO.email, CONTA_DEMO.senha);
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setRegLoading(true);
        try {
            await AuthService.register({ Nome: regNome, Email: regEmail, Senha: regSenha });
            toast.success("Conta criada com sucesso! Agora é só entrar.");
            setShowRegisterModal(false);
            setRegNome(''); setRegEmail(''); setRegSenha('');
        } catch (error) {
            toast.error(mensagemDeErro(error, "Erro ao realizar cadastro."));
        } finally { setRegLoading(false); }
    }

    return (
        <Container>
            <CarouselSection className="preserve-image">
                {slides.map((slide, index) => (
                    <BackgroundImage
                        className="preserve-image"
                        key={slide.id}
                        $src={slide.image}
                        $isActive={index === currentSlide}
                    />
                ))}
                <BrandOverlay />
                <CarouselContent key={currentSlide}>
                    <h1>{slides[currentSlide].title}</h1>
                    <p>{slides[currentSlide].description}</p>
                    <Indicators>
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`dot ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </Indicators>
                </CarouselContent>
            </CarouselSection>

            <FormSection>
                <FormCard $whiteLogoUrl={logoWhiteImg}>
                    <div className="logo-area">
                        <img src={logoImg} alt="Assina+" />
                        <h3>Gestão de planos e assinaturas</h3>
                    </div>

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-4">
                            <Form.Label>E-mail</Form.Label>
                            <InputGroup>
                                <InputGroup.Text style={{ background: 'white' }}><AiOutlineIdcard size={20} /></InputGroup.Text>
                                <Form.Control type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-5">
                            <Form.Label>Senha</Form.Label>
                            <InputGroup>
                                <InputGroup.Text style={{ background: 'white' }}><HiOutlineLockClosed size={20} /></InputGroup.Text>
                                <Form.Control type={showPassword ? "text" : "password"} placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                                <InputGroup.Text style={{ background: 'white', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Button type="submit" className="w-100 btn-primaria" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
                        </Button>
                        <Button type="button" variant="outline-secondary" className="w-100 mt-3 btn-demo" disabled={loading} onClick={handleDemo}>
                            Entrar com conta demo
                        </Button>
                    </Form>

                    <p className="text-center mt-4">
                        Ainda não tem conta?
                        <button type="button" className="link-cadastro" onClick={() => setShowRegisterModal(true)}>
                            Criar conta
                        </button>
                    </p>
                </FormCard>
            </FormSection>

            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>Criar conta</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem' }}>
                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><AiOutlineUser /></InputGroup.Text>
                                <Form.Control placeholder="Ex: Maria Silva" value={regNome} onChange={e => setRegNome(e.target.value)} required />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>E-mail</Form.Label>
                            <InputGroup>
                                <InputGroup.Text><AiOutlineIdcard /></InputGroup.Text>
                                <Form.Control type="email" placeholder="seu@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Defina uma Senha</Form.Label>
                            <Form.Control type="password" placeholder="Mínimo 6 caracteres" minLength={6} value={regSenha} onChange={e => setRegSenha(e.target.value)} required />
                        </Form.Group>

                        <div className="d-flex gap-2">
                            <Button variant="secondary" className="w-50" onClick={() => setShowRegisterModal(false)}>Cancelar</Button>
                            <Button type="submit" className="w-50 btn-primaria" disabled={regLoading}>
                                {regLoading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}