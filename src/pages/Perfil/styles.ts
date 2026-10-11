import styled from 'styled-components';

export const MainWrapper = styled.main`
  flex: 1;
  height: 100vh;
  overflow-y: auto;  
  padding: 2rem; 
  display: flex;
  flex-direction: column;
  gap: 2rem; 
`;

export const ProfileCard = styled.div`
  background-color: var(--branco);
  border-radius: 12px; 
  padding: 3rem;       
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 

  width: 100%;
  max-width: 700px;
  margin: 0 auto; 
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  .avatar-circle {
    width: 120px;
    height: 120px;
    background-color: var(--branco-secundario);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    border: 4px solid var(--branco);
    box-shadow: 0 0 0 3px var(--cor-primaria);
    
    svg {
      font-size: 60px;
      color: var(--cinza-secundario);
    }
  }

  h2 {
    color: var(--cor-primaria-escura);
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0;
  }

  span {
    color: var(--cinza-secundario);
    font-weight: 400;
    font-size: 1.1rem;
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.8rem;
    color: var(--cinza-primario);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  div {
    background: var(--branco-secundario);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid transparent;
    color: var(--preto-primario); 
    font-weight: 500;
    font-size: 1rem;
    
    &:hover {
      border-color: var(--cor-primaria);
      background: var(--branco);
    }
  }
`;