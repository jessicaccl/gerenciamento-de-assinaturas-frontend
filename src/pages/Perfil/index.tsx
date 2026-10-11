import { useEffect, useState } from 'react';
import { BiUserCircle } from 'react-icons/bi';
import { Spinner } from 'react-bootstrap';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';

import { MainWrapper, ProfileCard, AvatarSection, InfoGrid, InfoItem } from './styles';
import AuthService, { type UsuarioLogado } from '../../services/AuthService';

export function Perfil() {
    const [user, setUser] = useState<UsuarioLogado | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await AuthService.getMe();
                setUser(data);
            } catch (error) {
                console.error("Erro ao carregar perfil", error);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    return (
        <PageContainer>
            <Sidebar />

            <MainWrapper>
                <PageHeaderContainer
                    title="Meu Perfil"
                    icon={<BiUserCircle />}
                />

                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" variant="success" />
                    </div>
                ) : user ? (
                    <ProfileCard>

                        <AvatarSection>
                            <div className="avatar-circle">
                                <BiUserCircle />
                            </div>
                            <h2>{user.nome}</h2>
                            <span>{user.cargo || 'Colaborador'}</span>
                        </AvatarSection>

                        <hr style={{ width: '100%', borderTop: '1px solid #eee', margin: '0 0 2rem 0' }} />

                        <InfoGrid>
                            <InfoItem>
                                <label>Nome Completo</label>
                                <div>{user.nome}</div>
                            </InfoItem>

                            <InfoItem>
                                <label>E-mail</label>
                                <div>{user.email}</div>
                            </InfoItem>

                            <InfoItem>
                                <label>Perfil de acesso</label>
                                <div>{user.cargo === 'Admin' ? 'Administrador' : 'Colaborador'}</div>
                            </InfoItem>

                            <InfoItem>
                                <label>Data de Cadastro</label>
                                <div>
                                    {user.dataCadastro
                                        ? new Date(user.dataCadastro).toLocaleDateString('pt-BR')
                                        : '-'}
                                </div>
                            </InfoItem>
                        </InfoGrid>

                    </ProfileCard>
                ) : (
                    <div className="text-center text-muted mt-5">
                        <p>Não foi possível carregar os dados.</p>
                    </div>
                )}

            </MainWrapper>
        </PageContainer>
    );
}