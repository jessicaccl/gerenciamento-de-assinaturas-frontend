import styled from "styled-components";

export const MainWrapper = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const ButtonNew = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--texto-sobre-cor);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: var(--branco);
    color: var(--cor-primaria-escura);
    transform: scale(1.02);
  }
`;

export const TableContainer = styled.div`
  background-color: var(--branco);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid var(--branco-secundario);

  .table {
    margin-bottom: 0;
    
    thead th {
      border-bottom: 2px solid var(--cor-primaria);
      color: var(--cinza-secundario);
      font-weight: 600;
      padding-bottom: 1rem;
    }

    tbody td {
      vertical-align: middle;
      color: var(--cinza-primario);
      padding: 1rem 0.5rem;
    }
  }
`;

export const StatusBadge = styled.span<{ $ativo: boolean }>`
  background-color: ${(props) => (props.$ativo ? "#d1e7dd" : "#f8d7da")};
  color: ${(props) => (props.$ativo ? "#0f5132" : "#842029")};
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  margin: 0 0.3rem;
  padding: 0.4rem;
  border-radius: 4px;
  transition: 0.2s;
  
  color: ${(props) => (props.$variant === 'edit' ? 'var(--amarelo-primario)' : '#d9534f')};

  &:hover {
    background-color: ${(props) => (props.$variant === 'edit' ? '#fff3cd' : '#f8d7da')};
  }
`;