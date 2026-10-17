import styled, { createGlobalStyle } from 'styled-components';

export const GlobalHighContrast = createGlobalStyle`  
  body.high-contrast, body.high-contrast #root {
    background-color: #000 !important;
  }
  
  body.high-contrast * {
    background-color: #000 !important;
    color: #ffff00 !important; 
    border-color: #fff !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  body.high-contrast .preserve-image,
  body.high-contrast .preserve-image * {
    background-color: transparent !important; 
    filter: none !important; 
    color: inherit !important; 
  }

  body.high-contrast button, 
  body.high-contrast input, 
  body.high-contrast select, 
  body.high-contrast textarea {
    border: 2px solid #ffff00 !important;
    background-color: #000 !important;
    color: #ffff00 !important;
  }
  
  body.high-contrast a {
    color: #00ff00 !important; 
    text-decoration: underline;
  }

  body.high-contrast img:not(.preserve-image) {
    filter: grayscale(100%) contrast(120%);
  }
`;

export const ContainerBarra = styled.div`
  position: fixed;
  right: 0;        
  top: 15%;        
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: var(--branco);
  padding: 10px;
  border-radius: 8px 0 0 8px;
  box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
  z-index: 9999;

  body.high-contrast & {
    background: #000;
    border: 1px solid #ffff00;
  }
`;

export const BotaoAcessibilidade = styled.button`
  background: var(--cor-primaria);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    background: var(--roxo-900);
  }
  
  body.high-contrast & {
    color: #ffff00 !important;
    border: 1px solid #ffff00 !important;
  }
`;