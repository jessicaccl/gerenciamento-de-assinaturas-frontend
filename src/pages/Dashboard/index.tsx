import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaRegClock, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Sidebar } from '../../components/Sidebar';
import PageContainer from '../../components/PageContainer';
import PageHeaderContainer from '../../components/PageHeaderContainer';
import PageContentContainer from '../../components/PageContentContainer';

import AssinaturaService from '../../services/AssinaturaService';
import PlanoService from '../../services/PlanoService';

import { MainWrapper, GridDashboard, CardMetric } from './styles';

interface Assinatura {
  id: number;
  status: string;
  dataExpiracao?: string;
}

interface Plano {
  id: number;
  ativo: boolean;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    ativas: 0,
    expirar: 0,
    planos: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [assinaturasData, planosData] = await Promise.all([
          AssinaturaService.getAll(),
          PlanoService.getAll()
        ]);

        const assinaturas = assinaturasData as Assinatura[];
        const planos = planosData as Plano[];

        const totalAtivas = assinaturas.filter(a => a.status === 'Ativo').length;

        const totalPlanos = planos.length;

        const hoje = new Date();
        const trintaDiasFrente = new Date();
        trintaDiasFrente.setDate(hoje.getDate() + 30);

        const totalExpirando = assinaturas.filter(a => {
          if (!a.dataExpiracao || a.status !== 'Ativo') return false;

          const dataExp = new Date(a.dataExpiracao);

          return dataExp >= hoje && dataExp <= trintaDiasFrente;
        }).length;

        setMetrics({
          ativas: totalAtivas,
          expirar: totalExpirando,
          planos: totalPlanos
        });

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        toast.error("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <PageContainer>
      <Sidebar />

      <MainWrapper>
        <PageHeaderContainer
          title="Dashboard de Gerenciamento"
          icon={<FaChartLine />}
        />

        <PageContentContainer>
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="success" />
            </div>
          ) : (
            <GridDashboard>
              <CardMetric>
                <header>
                  <h3><FaChartLine /> Assinaturas Ativas</h3>
                </header>
                <div className="value">
                  {metrics.ativas} <span>assinantes</span>
                </div>
                <p>Total de usuários com acesso ativo ao sistema no momento.</p>
                <button onClick={() => navigate('/assinaturas')}>Ver Relatório</button>
              </CardMetric>

              <CardMetric className="warning">
                <header>
                  <h3><FaRegClock /> A Expirar</h3>
                </header>
                <div className="value">
                  {metrics.expirar} <span>próx. 30 dias</span>
                </div>
                <p>Assinaturas que requerem renovação em breve.</p>
                <button disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>Notificar Todos</button>
              </CardMetric>

              <CardMetric>
                <header>
                  <h3><FaLayerGroup /> Planos</h3>
                </header>
                <div className="value">
                  {metrics.planos} <span>disponíveis</span>
                </div>
                <p>Modelos de planos cadastrados no sistema.</p>
                <button onClick={() => navigate('/planos')}>Gerenciar Planos</button>
              </CardMetric>
            </GridDashboard>
          )}
        </PageContentContainer>
      </MainWrapper>
    </PageContainer>
  );
}