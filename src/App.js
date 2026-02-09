import * as React from 'react';
import { ThemeProvider, GlobalStyles } from "@mui/material";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import Pulse from "./components/Pulse";
import { getTheme } from "./theme";
import { ModeProvider, useMode } from "./context/ModeContext";

function App() {
  const [mode, setMode] = React.useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    const saved = window.localStorage.getItem('portfolio:colorMode');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const toggleDarkMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('portfolio:colorMode', mode);
  }, [mode]);

  return (
    <ModeProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ html: { scrollBehavior: 'smooth', scrollPaddingTop: '96px' } }} />
        <Layout darkMode={mode === 'dark'} toggleDarkMode={toggleDarkMode}>
          <Hero />
          <About />
          <DevContent /> 
          <Projects />
          <Blogs />
          <Contact />
        </Layout>
      </ThemeProvider>
    </ModeProvider>
  );
}

const DevContent = () => {
    const { mode } = useMode();
    return mode === 'dev' ? <Pulse /> : null;
};

export default App;
