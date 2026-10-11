import styled from 'styled-components';

export const MainWrapper = styled.main`
  flex: 1;   
  height: 100vh; 
  overflow-y: auto; 
  padding: 2rem;  
  display: flex;
  flex-direction: column;
`;

export const GridDashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export const CardMetric = styled.div`
  background: var(--branco);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid var(--branco-secundario);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--cor-primaria);
    box-shadow: 0 10px 20px rgba(109, 40, 217, 0.15);
  }

  header {
    margin-bottom: 1rem;
    h3 {
      color: var(--cor-primaria-escura);
      font-size: 1.2rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .value {
    font-size: 2.5rem;
    font-weight: 300;
    color: var(--cinza-secundario);
    margin-bottom: 1rem;
    
    span {
      font-size: 1rem;
      color: var(--cinza-primario);
      margin-left: 0.5rem;
    }
  }

  p {
    color: var(--cinza-primario);
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  button {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid var(--cor-primaria);
    background: transparent;
    color: var(--cor-primaria);
    font-weight: 600;
    border-radius: 8px;
    transition: 0.3s;

    &:hover {
      background: var(--cor-primaria);
      color: white;
    }
  }

  &.warning {
    border-left: 5px solid #d9534f;
    .value { color: #d9534f; }
    button {
      border-color: #d9534f;
      color: #d9534f;
      &:hover { background: #d9534f; color: white; }
    }
  }
`;