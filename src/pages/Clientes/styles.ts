import styled from "styled-components";

export { MainWrapper } from "../Assinaturas/styles";

export const BarraFiltros = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1.5rem;

  input {
    flex: 1;
    min-width: 220px;
  }
`;

export const ChipSituacao = styled.button<{ $ativo: boolean }>`
  border: 1px solid ${(p) => (p.$ativo ? "var(--cor-primaria)" : "var(--branco-secundario)")};
  background: ${(p) => (p.$ativo ? "var(--superficie-destaque)" : "var(--branco)")};
  color: ${(p) => (p.$ativo ? "var(--cor-primaria)" : "var(--cinza-primario)")};
  border-radius: 8px;
  padding: 0.35rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const GridClientes = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Cartao = styled.section`
  background: var(--branco);
  border: 1px solid var(--branco-secundario);
  border-radius: 12px;
  padding: 1rem 1.25rem;
`;

export const LinhaCliente = styled.button<{ $selecionado: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) 95px 95px 110px;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  text-align: left;
  background: ${(p) => (p.$selecionado ? "var(--superficie-destaque)" : "transparent")};
  border: none;
  border-top: 1px solid var(--borda-suave);
  padding: 0.65rem 0.5rem;
  font-size: 0.9rem;
  color: var(--cinza-secundario);

  &:hover { background: var(--superficie-suave); }

  &.cabecalho {
    border-top: none;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--cinza-primario);
    cursor: default;
    &:hover { background: transparent; }
  }

  .nome { display: block; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  small { color: var(--cinza-primario); }

  @media (max-width: 576px) {
    grid-template-columns: minmax(0, 1fr) 110px;
    .col-opcional { display: none; }
  }
`;

const coresSituacao: Record<string, { fundo: string; texto: string }> = {
  "Em dia": { fundo: "#d1fae5", texto: "#065f46" },
  "A vencer": { fundo: "#fef3c7", texto: "#92400e" },
  Inadimplente: { fundo: "#f8d7da", texto: "#842029" },
  Ativo: { fundo: "#d1fae5", texto: "#065f46" },
  Inativo: { fundo: "#e9ecef", texto: "#495057" },
  Pendente: { fundo: "#ede9fe", texto: "var(--roxo-900)" },
  Vencida: { fundo: "#f8d7da", texto: "#842029" },
  Paga: { fundo: "#d1fae5", texto: "#065f46" },
};

export const Etiqueta = styled.span<{ $valor: string }>`
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => coresSituacao[p.$valor]?.fundo ?? "#e9ecef"};
  color: ${(p) => coresSituacao[p.$valor]?.texto ?? "#495057"};
`;

export const Ficha = styled(Cartao)`
  position: sticky;
  top: 1rem;

  .topo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--superficie-destaque);
    color: var(--cor-primaria-escura);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
  }

  h3 { font-size: 1.15rem; font-weight: 700; color: var(--cor-primaria-escura); margin: 0; }

  .metricas {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;

    div { background: var(--superficie-suave); border-radius: 8px; padding: 0.6rem 0.75rem; }
    span { display: block; font-size: 0.75rem; color: var(--cinza-primario); }
    strong { font-size: 1.05rem; }
  }

  h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--cinza-secundario);
    margin: 1.1rem 0 0.4rem;
  }

  .contato {
    display: grid;
    grid-template-columns: 110px minmax(0, 1fr);
    row-gap: 0.3rem;
    font-size: 0.9rem;

    span:nth-child(odd) { color: var(--cinza-primario); }
    span:nth-child(even) { overflow-wrap: anywhere; }
  }

  .linha {
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.45rem 0;
    border-top: 1px solid var(--borda-suave);
    font-size: 0.88rem;

    small { color: var(--cinza-primario); }
  }

  .acoes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }
`;
