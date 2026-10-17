import styled from "styled-components";

export const MainWrapper = styled.main`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

export const GridPlanos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const CardPlano = styled.div`
  background: var(--branco);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    border-color: var(--cor-primaria);
  }

  header {
    margin-bottom: 1.5rem;
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: 1.4rem; 
      color: var(--cor-primaria-escura);
      font-weight: 600; 
      margin: 0;
      line-height: 1.2;
    }

    .price {
      font-size: 2.5rem;
      font-weight: 400; 
      color: var(--cinza-primario);
      margin-top: 0.5rem;
      letter-spacing: -1px; 
      
      span {
        font-size: 1rem;
        color: var(--cinza-secundario);
        font-weight: 300; 
        margin-left: 4px;
      }
    }
  }

  p {
    color: var(--cinza-secundario);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-weight: 400; 
    flex: 1;
  }
`;

export const ButtonNew = styled.button`
  background-color: var(--branco); 
  color: var(--cinza-primario); 
  border: 1px solid var(--borda-campo); 
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); 

  svg {
    color: var(--cor-primaria); 
  }

  &:hover {
    background-color: var(--superficie-suave); 
    border-color: var(--cinza-secundario);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

export const ActionButton = styled.button<{ $variant: 'edit' | 'delete' }>`
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  color: ${(props) => (props.$variant === 'edit' ? 'var(--cinza-primario)' : '#fa5252')};

  &:hover {
    background-color: ${(props) => (props.$variant === 'edit' ? 'var(--superficie-suave)' : 'rgba(220, 53, 69, 0.1)')};
    color: ${(props) => (props.$variant === 'edit' ? 'var(--cinza-secundario)' : '#e03131')};
  }

  svg {
    font-size: 15px; 
  }
`;

export const ButtonSubscribe = styled.button`
  background-color: var(--branco); 
  color: var(--cor-primaria); 
  border: 2px solid var(--cor-primaria); 
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 700; 
  font-size: 1rem;
  margin-top: auto;
  transition: all 0.3s ease; 

  &:hover {
    background-color: var(--cor-primaria); 
    color: var(--texto-sobre-cor); 
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(109, 40, 217, 0.3); 
  }

  &:active {
    transform: translateY(0);
  }
`;