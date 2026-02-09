import React, { createContext, useContext, useEffect, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  // 'dev' or 'recruiter'
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') {
      return 'dev';
    }
    const saved = window.localStorage.getItem('portfolio:viewMode');
    return saved === 'recruiter' ? 'recruiter' : 'dev';
  });

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'dev' ? 'recruiter' : 'dev'));
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('portfolio:viewMode', mode);
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
