import styled from "styled-components";
interface SidebarStyleProps {
  $whiteLogoUrl: string;
}

export const SidebarStyle = styled.aside<SidebarStyleProps>` 
  position: fixed;
  left: 0;
  top: 1.5rem;
  bottom: 0;
  height: calc(100vh - 3rem);
  width: 110px; /* Largura fixa */
  z-index: 1000;
  
  background-color: var(--branco);
  
  box-shadow: 5px 0 30px rgba(0,0,0,0.1);  
  border-radius: 0 20px 20px 0; 

  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  transition: all 0.3s ease;

  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

  html body.high-contrast & {
    background-color: #000 !important; 
    border-right: 1px solid #fff !important; 
    box-shadow: none !important;

    .logo-area img {
      content: url("${props => props.$whiteLogoUrl}") !important;
      filter: none !important;
      background: transparent !important;
      width: 55px !important;
      height: auto !important;
    }

    .area-icons-label {
      color: #fff !important;      
      
      &.active {
        background-color: #000 !important;
        border: 2px solid #ffff00 !important; 
        color: #ffff00 !important;
        svg { color: #ffff00 !important; }
      }

      &:hover {
        background-color: #000 !important;
        border: 1px solid #fff !important;
        color: #fff !important;
      }
    }

    .footer-group {
      border-top: 1px solid #fff !important;
    }

    .user-container, .logout-btn {
      color: #fff !important;
      svg { color: #fff !important; }

      &:hover {
        border: 1px solid #ffff00 !important;
        color: #ffff00 !important;
        svg { color: #ffff00 !important; }
      }
    }
  }

  .column-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .logo-area {
    margin-bottom: 2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition: transform 0.2s;    
    padding-top: 10px; 

    img {
      width: 55px; 
      height: auto;
    }

    &:hover { transform: scale(1.05); }
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 0.8rem; 
    flex: 1; 
  }

  .sidebar-nav-item {
    width: 90%;
    display: flex;
    justify-content: center;
  }

  .area-icons-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    width: 100%;
    padding: 14px 0; 
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--cinza-secundario);

    svg {
      font-size: 1.6rem;
      margin-bottom: 8px; 
      transition: color 0.2s;
    }

    .label-sidebar {
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
    }

    &:hover {
      background-color: #f8f9fa;
      color: var(--cor-primaria);
    }

    &.active {
      background-color: rgba(109, 40, 217, 0.1);
      color: var(--cor-primaria);
      font-weight: 600;      
    }
  }

  .footer-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    border-top: 1px solid #f0f0f0;
    padding-top: 1.5rem;
    gap: 1.5rem;    
    padding-bottom: 10px;
  }

  .user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--cinza-primario);

    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
      .label-sidebar { color: var(--cor-primaria); }
      svg { color: var(--cor-primaria); }
    }
    
    svg { font-size: 1.8rem; margin-bottom: 4px; color: var(--cinza-secundario); }
    .label-sidebar { font-size: 0.75rem; font-weight: 700; }
  }

  .logout-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    color: var(--cinza-secundario);
    transition: 0.2s;
    padding: 10px;
    border-radius: 8px;

    svg { font-size: 1.6rem; margin-bottom: 4px; }
    span { font-size: 0.75rem; font-weight: 500; }

    &:hover {
      background-color: #fff5f5;
      color: #dc3545; 
    }
  }
`;