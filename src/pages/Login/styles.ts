import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: var(--branco-primario);
`;

export const CarouselSection = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 4rem;
  background-color: var(--cor-primaria-profunda);

  @media (max-width: 992px) {
    display: none;
  }
`;

interface BackgroundImageProps {
  $isActive: boolean;
  $src: string;
}

export const BackgroundImage = styled.div<BackgroundImageProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("${props => props.$src}");
  background-size: cover;
  background-position: center;
  opacity: ${props => (props.$isActive ? 1 : 0)};
  transition: opacity 1.5s ease-in-out;
  z-index: 1;
`;

export const BrandOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(46, 16, 101, 0.1) 0%,
    rgba(46, 16, 101, 0.55) 55%,
    var(--cor-primaria-profunda) 100%
  );
  z-index: 2;
`;

export const CarouselContent = styled.div`
  position: relative;
  z-index: 3;
  color: var(--texto-sobre-cor);
  max-width: 500px;
  animation: ${fadeIn} 1s ease-out;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    line-height: 1.5;
  }
`;

export const Indicators = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
  position: relative;
  z-index: 3;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s;

    &.active {
      background-color: var(--texto-sobre-cor);
      width: 30px;
      border-radius: 5px;
    }
  }
`;

export const FormSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--branco);
  padding: 2rem;
`;
interface FormCardProps {
  $whiteLogoUrl: string;
}

export const FormCard = styled.div<FormCardProps>`
  width: 100%;
  max-width: 450px;
  animation: ${fadeIn} 0.8s ease-out;

  .logo-area {
    margin-bottom: 2rem;
    text-align: center;
    
    img {
      max-width: 160px;
    }

    h3 {
      color: var(--cinza-secundario);
      font-weight: 300; 
      font-size: 1.5rem;
      margin-top: 10px;
    }
  }

  html body.high-contrast & {
    .logo-area {
      img {        
        content: url("${props => props.$whiteLogoUrl}") !important;
        
        filter: none !important;
        -webkit-filter: none !important;
        background: transparent !important;
        max-width: 160px !important; 
        height: auto;
      }
      
      h3 {
        color: #ffffff !important;
      }
    }
    
     input, .input-group-text {
       border-color: #ffffff !important;
       color: #ffffff !important;
       background-color: #000 !important;
    }
     .input-group-text svg {
         fill: #ffffff !important;
     }
  }

  .btn-demo {
    padding: 0.7rem;
    font-weight: 600;
  }

  .link-cadastro {
    background: none;
    border: none;
    padding: 0;
    margin-left: 5px;
    color: var(--cor-primaria);
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }

  .btn-primaria {
    background-color: var(--cor-primaria);
    border: none;
    padding: 0.8rem;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s;

    &:hover {
      background-color: var(--roxo-900);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(46, 16, 101, 0.4);
    }
  }
`;