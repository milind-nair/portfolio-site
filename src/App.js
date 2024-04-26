import * as React from 'react';
import PersistentDrawerLeft from "./components/ResponsiveDrawer";
import { createTheme, ThemeProvider } from "@mui/material";


function App() {
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <PersistentDrawerLeft darkMode={darkMode} toggleDarkMode ={toggleDarkMode} />
        
      </ThemeProvider>
    </>
  );
}

export default App;
