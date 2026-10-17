import styled from "styled-components";
interface SidebarMobileStyleProps {
  $whiteLogoUrl: string;
}

export const SidebarMobileStyle = styled.div<SidebarMobileStyleProps>` 
  width: 100%;
  height: 70px; 
  flex-shrink: 0; 
  
  background-color: var(--branco);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
  position: sticky; 
  top: 0;
  z-index: 1020;
  
  display: flex;
  align-items: center;

  html body.high-contrast & {
    background-color: #000 !important;
    border-bottom: 1px solid #fff !important;
    box-shadow: none !important;

    .button-show-area {
      background-color: #000 !important;
      
      .button-show svg, .right-area svg {
        color: #fff !important;
      }

      .central-area {
        img {
          content: url("${props => props.$whiteLogoUrl}") !important;
          filter: none !important;
          background: transparent !important;
        }
        span {
          color: #fff !important;
          &::before { color: #fff !important; opacity: 1; }
        }
      }
    }
  } 

  .button-show-area {
    width: 100%;
    height: 100%; 
    padding: 0 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--branco);

    .central-area {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      img {
        height: 35px;
        width: auto;
      }

      span {
        color: var(--cor-destaque);
        font-weight: 700;
        font-size: 1rem;
        
        @media (max-width: 360px) {
           display: none;
        }

        &::before {
          content: "|";
          margin-right: 0.5rem;
          font-weight: 300;
          opacity: 0.5;
          color: var(--cinza-primario);
        }
      }
    }

    .right-area svg {
      font-size: 28px;
      color: var(--cinza-secundario); 
    }

    .button-show {
      display: flex; 
      svg {
        color: var(--cor-primaria);
        font-size: 28px;
        cursor: pointer;
        transition: 0.2s;

        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
`;

export const SidebarMobileNavStyle = styled.div`
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 1rem;

  html body.high-contrast & {    
    .sidebar-mobile-nav .sidebar-nav-item .area-icons-label {
      color: #fff !important;
      border: 1px solid transparent; 
      
      svg { color: #fff !important; }

      &.active {
        background-color: #000 !important;
        border: 1px solid #ffff00 !important;
        color: #ffff00 !important;
        svg { color: #ffff00 !important; }
      }

      &:hover {
         border-color: #fff !important;
      }
    }

    .user-container {
      background-color: #000 !important;
      border: 1px solid #fff !important;
      color: #fff !important;
      
      svg { color: #fff !important; }
      #user-department { color: #ddd !important; }

      &:hover {
        border-color: #ffff00 !important;
        color: #ffff00 !important;
        svg { color: #ffff00 !important; }
      }
    }
  }

  .sidebar-mobile-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; 

    .sidebar-nav-item {
      width: 100%;
      
      .area-icons-label {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem 1rem;
        border-radius: 8px; 
        color: var(--cinza-secundario);
        transition: all 0.2s;

        svg {
          font-size: 22px;
          color: var(--cinza-secundario); 
        }

        span {
          font-weight: 500;
        }

        &:hover {
          cursor: pointer;
          background-color: var(--superficie-suave); 
          color: var(--cor-primaria);
          
          svg { color: var(--cor-primaria); }
        }

        &.active {
          background-color: rgba(109, 40, 217, 0.1); 
          color: var(--cor-primaria);
          font-weight: 600;

          svg { color: var(--cor-primaria); }
        }
      }

      .logout {
        color: var(--vermelho-primario) !important;
        margin-top: 1rem;
        
        svg { color: var(--vermelho-primario) !important; }
        
        &:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }
      }
    }
  }

  .user-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    background-color: var(--superficie-suave); 
    border: 1px solid var(--borda-suave);
    color: var(--preto-primario); 

    cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: var(--borda-suave); 
  }
    
    padding: 1rem;
    width: 100%;
    border-radius: 12px;
    margin-top: auto; 
    margin-bottom: 2rem;

    svg {
      font-size: 30px;
      color: var(--cinza-secundario);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      
      span {
        font-size: 0.95rem;
        font-weight: 600;
      }

      #user-department {
        font-size: 0.8rem;
        font-weight: 400;
        color: var(--cinza-secundario);
      }
    }
  }
`;

interface LogoAreaProps {
  $whiteLogoUrl: string;
}

export const LogoArea = styled.div<LogoAreaProps>`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    max-width: 40px; 
    height: auto;
  }

  span {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--texto-sobre-cor); 
  }
  
  span {
      color: var(--cor-destaque);
  }

  html body.high-contrast & {
    img {
      content: url("${props => props.$whiteLogoUrl}") !important;
      filter: none !important;
      background: transparent !important;
      max-width: 40px !important;
      height: auto;
    }

    span {
      color: #ffffff !important;
    }
  }
`;

export const CloseIconArea = styled.div`
  svg {
    font-size: 24px !important;
    color: var(--cinza-secundario);
    cursor: pointer;

    html body.high-contrast & {
        color: #fff !important;
        &:hover { color: #ffff00 !important; }
    }

    &:hover {
      color: var(--vermelho-primario) !important;
    }
  }
`;