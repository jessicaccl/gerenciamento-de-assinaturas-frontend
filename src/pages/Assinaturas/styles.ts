import styled from "styled-components";

export const MainWrapper = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
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
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    tbody td {
      vertical-align: middle;
      color: var(--cinza-primario);
      padding: 1rem 0.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    tbody tr:last-child td {
      border-bottom: none;
    }
  }
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' | 'reactivate' }>`
  background: transparent;
  border: none;
  font-size: 1.1rem;
  margin: 0 0.3rem;
  padding: 0.4rem;
  border-radius: 4px;
  transition: 0.2s;
  
  color: ${(props) => {
    if (props.$variant === 'edit') return 'var(--amarelo-primario)';
    if (props.$variant === 'delete') return '#d9534f';
    if (props.$variant === 'reactivate') return '#28a745';
    return 'var(--cinza-primario)';
  }};

  &:hover {
    background-color: ${(props) => {
      if (props.$variant === 'edit') return '#fff3cd';
      if (props.$variant === 'delete') return '#f8d7da';
      if (props.$variant === 'reactivate') return '#d4edda';
      return '#f0f0f0';
    }};
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-end; 
  align-items: center;       
  gap: 1rem;

  select {
    min-width: 180px;
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid #ced4da;
    background-color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--cinza-primario);
    cursor: pointer;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--cor-primaria);
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.15);
    }
  }
`;