import React, { createContext, useContext, useState, useEffect } from 'react';

interface AcessibilidadeContextData {
  fonteScale: number;
  altoContraste: boolean;
  aumentarFonte: () => void;
  diminuirFonte: () => void;
  toggleContraste: () => void;
}

const AcessibilidadeContext = createContext<AcessibilidadeContextData>({} as AcessibilidadeContextData);

export const AcessibilidadeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fonteScale, setFonteScale] = useState(100); 
  const [altoContraste, setAltoContraste] = useState(false);

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

  function aumentarFonte() {
    if (fonteScale < 150) setFonteScale(fonteScale + 10);
  }

  function diminuirFonte() {
    if (fonteScale > 70) setFonteScale(fonteScale - 10);
  }

  function toggleContraste() {
    setAltoContraste(!altoContraste);
  }

  return (
    <AcessibilidadeContext.Provider value={{ 
      fonteScale, 
      altoContraste, 
      aumentarFonte, 
      diminuirFonte, 
      toggleContraste 
    }}>
      {children}
    </AcessibilidadeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAcessibilidade = () => useContext(AcessibilidadeContext);