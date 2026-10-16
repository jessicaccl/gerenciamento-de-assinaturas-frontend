import styled from 'styled-components';

export const MainWrapper = styled.main`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const GridMetricas = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const CardMetrica = styled.div<{ $cor?: string }>`
  background: var(--branco);
  border: 1px solid var(--branco-secundario);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;

  .rotulo {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--cinza-primario);
  }

  .valor {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${(props) => props.$cor ?? 'var(--cor-primaria-escura)'};
    margin: 0.25rem 0;
  }

  .detalhe {
    font-size: 0.8rem;
    color: var(--cinza-primario);
  }
`;

export const GridPaineis = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Painel = styled.section`
  background: var(--branco);
  border: 1px solid var(--branco-secundario);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;

    h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--cor-primaria-escura);
      margin: 0;
    }
  }

  .vazio {
    color: var(--cinza-primario);
    font-size: 0.9rem;
    text-align: center;
    padding: 1.5rem 0;
  }
`;

export const SeletorPeriodo = styled.div`
  display: flex;
  gap: 0.4rem;

  button {
    border: 1px solid var(--branco-secundario);
    background: transparent;
    color: var(--cinza-primario);
    border-radius: 8px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;

    &.ativo {
      border-color: var(--cor-primaria);
      color: var(--cor-primaria);
      background: #f5f3ff;
    }
  }
`;

export const FaixaAging = styled.div<{ $percentual: number; $cor: string }>`
  margin-bottom: 0.9rem;

  .linha {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;

    small { color: var(--cinza-primario); }
  }

  .barra {
    height: 8px;
    background: var(--branco-primario);
    border-radius: 4px;
    margin-top: 0.3rem;

    div {
      height: 100%;
      width: ${(props) => props.$percentual}%;
      background: ${(props) => props.$cor};
      border-radius: 4px;
    }
  }
`;

export const ListaVencimentos = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-top: 1px solid var(--branco-primario);

    &:first-child { border-top: none; }

    strong { display: block; font-size: 0.9rem; color: var(--cinza-secundario); }
    small { color: var(--cinza-primario); }
    .valor { font-weight: 700; color: var(--cinza-secundario); text-align: right; }
  }
`;
