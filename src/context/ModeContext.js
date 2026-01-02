import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  // 'dev' or 'recruiter'
  const [mode, setMode] = useState('dev');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'dev' ? 'recruiter' : 'dev'));
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
