import React, { createContext, useContext, useState, useEffect } from 'react';

interface AcessibilidadeContextData {
  fonteScale: number;
  altoContraste: boolean;
  modoEscuro: boolean;
  aumentarFonte: () => void;
  diminuirFonte: () => void;
  toggleContraste: () => void;
  toggleModoEscuro: () => void;
}

const AcessibilidadeContext = createContext<AcessibilidadeContextData>({} as AcessibilidadeContextData);

const CHAVE_TEMA = 'assina-tema';

// Na primeira visita segue o sistema operacional; depois, a escolha da pessoa fica salva
function temaInicialEscuro() {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);
    if (salvo) return salvo === 'escuro';
  } catch {
    // localStorage indisponível (ex.: navegação privada): segue o sistema
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export const AcessibilidadeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fonteScale, setFonteScale] = useState(100);
  const [altoContraste, setAltoContraste] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(temaInicialEscuro);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fonteScale}%`;
  }, [fonteScale]);

  useEffect(() => {
    if (altoContraste) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [altoContraste]);

  // data-tema troca a paleta do Assina+; data-bs-theme troca o tema dos componentes do Bootstrap
  useEffect(() => {
    const html = document.documentElement;
    if (modoEscuro) {
      html.dataset.tema = 'escuro';
      html.dataset.bsTheme = 'dark';
    } else {
      delete html.dataset.tema;
      delete html.dataset.bsTheme;
    }
    try {
      localStorage.setItem(CHAVE_TEMA, modoEscuro ? 'escuro' : 'claro');
    } catch {
      // sem persistência, o tema vale só para esta sessão
    }
  }, [modoEscuro]);

  function aumentarFonte() {
    if (fonteScale < 150) setFonteScale(fonteScale + 10);
  }

  function diminuirFonte() {
    if (fonteScale > 70) setFonteScale(fonteScale - 10);
  }

  function toggleContraste() {
    setAltoContraste(!altoContraste);
  }

  function toggleModoEscuro() {
    setModoEscuro(!modoEscuro);
  }

  return (
    <AcessibilidadeContext.Provider value={{
      fonteScale,
      altoContraste,
      modoEscuro,
      aumentarFonte,
      diminuirFonte,
      toggleContraste,
      toggleModoEscuro
    }}>
      {children}
    </AcessibilidadeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAcessibilidade = () => useContext(AcessibilidadeContext);
