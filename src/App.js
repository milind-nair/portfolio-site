import * as React from 'react';
import { ThemeProvider } from "@mui/material";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { getTheme } from "./theme";

function App() {
  const [mode, setMode] = React.useState('light');

  const toggleDarkMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Layout darkMode={mode === 'dark'} toggleDarkMode={toggleDarkMode}>
         <Hero />
         <About />
         <Projects />
         <Contact />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
