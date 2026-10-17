import { FaMoon, FaSun, FaAdjust } from 'react-icons/fa';
import { useAcessibilidade } from './Context';
import { ContainerBarra, BotaoAcessibilidade, GlobalHighContrast } from './styles';

export const Acessibilidade = () => {
  const { aumentarFonte, diminuirFonte, toggleContraste, toggleModoEscuro, modoEscuro, altoContraste } = useAcessibilidade();

  return (
    <>
      <GlobalHighContrast />

      <ContainerBarra role="toolbar" aria-label="Acessibilidade e aparência">
        <BotaoAcessibilidade onClick={aumentarFonte} title="Aumentar fonte" aria-label="Aumentar fonte">
          A+
        </BotaoAcessibilidade>

        <BotaoAcessibilidade onClick={diminuirFonte} title="Diminuir fonte" aria-label="Diminuir fonte">
          A-
        </BotaoAcessibilidade>

        <BotaoAcessibilidade
          onClick={toggleModoEscuro}
          title={modoEscuro ? 'Modo claro' : 'Modo escuro'}
          aria-label={modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
          aria-pressed={modoEscuro}
        >
          {modoEscuro ? <FaSun size={18} /> : <FaMoon size={18} />}
        </BotaoAcessibilidade>

        <BotaoAcessibilidade
          onClick={toggleContraste}
          title="Alto contraste"
          aria-label="Alto contraste"
          aria-pressed={altoContraste}
        >
          <FaAdjust size={18} />
        </BotaoAcessibilidade>
      </ContainerBarra>
    </>
  );
};
