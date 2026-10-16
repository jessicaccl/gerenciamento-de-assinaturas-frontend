import styled from "styled-components";

export { MainWrapper, TableContainer, FilterContainer } from "../Assinaturas/styles";

export const ResumoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

export const ResumoCard = styled.div<{ $cor: string }>`
  background-color: var(--branco);
  border: 1px solid var(--branco-secundario);
  border-left: 4px solid ${(props) => props.$cor};
  border-radius: 0 12px 12px 0;
  padding: 1rem 1.25rem;

  span {
    display: block;
    font-size: 0.85rem;
    color: var(--cinza-primario);
  }

  strong {
    display: block;
    font-size: 1.5rem;
    color: ${(props) => props.$cor};
  }

  small {
    color: var(--cinza-primario);
  }
`;

const coresStatus: Record<string, { fundo: string; texto: string }> = {
  Pendente: { fundo: "#ede9fe", texto: "var(--cor-primaria-escura)" },
  Vencida: { fundo: "#f8d7da", texto: "#842029" },
  Paga: { fundo: "#d1fae5", texto: "#065f46" },
  Cancelada: { fundo: "#e9ecef", texto: "#495057" },
};

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: ${(props) => coresStatus[props.$status]?.fundo ?? "#e9ecef"};
  color: ${(props) => coresStatus[props.$status]?.texto ?? "#495057"};
`;

export const BotaoAcao = styled.button<{ $variante: "pagar" | "cancelar" }>`
  background: transparent;
  border: 1px solid ${(props) => (props.$variante === "pagar" ? "var(--cor-destaque)" : "#d9534f")};
  color: ${(props) => (props.$variante === "pagar" ? "var(--cor-destaque)" : "#d9534f")};
  border-radius: 8px;
  padding: 0.3rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.4rem;
  transition: 0.2s;

  &:hover {
    background-color: ${(props) => (props.$variante === "pagar" ? "var(--cor-destaque)" : "#d9534f")};
    color: #fff;
  }
`;
