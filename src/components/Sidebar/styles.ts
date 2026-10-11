import styled from 'styled-components';

export const SidebarContainer = styled.aside`
  width: 100px;
  height: calc(100vh - 40px);
  background-color: #ffffff;
  
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.02);
  
  transition: all 0.3s ease;
`;

export const LogoArea = styled.div`
  margin-bottom: 3.5rem;
  img {
    width: 50px;
    height: auto;
  }
`;

export const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  width: 100%;
`;

export const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  position: relative;
  
  color: ${props => props.$active ? 'var(--cor-primaria)' : '#94a3b8'}; 
  transition: all 0.2s ease;

  &:hover {
    color: var(--cor-primaria);
  }

  &::before {
    content: '';
    position: absolute;
    left: 8px;
    width: 4px;
    height: ${props => props.$active ? '30px' : '0'};
    background-color: var(--cor-primaria);
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  svg {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }

  span {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
`;

export const LogoutArea = styled.div`
  margin-top: auto;
  width: 100%;
  display: flex;
  justify-content: center;

  svg {
    font-size: 1.6rem;
    color: #94a3b8;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #d9534f;
    }
  }
`;