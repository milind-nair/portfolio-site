import * as React from 'react';
import PersistentDrawerLeft from "./components/ResponsiveDrawer";
import { createTheme, ThemeProvider, Button } from "@mui/material";


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
        <PersistentDrawerLeft />
        <Button onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </ThemeProvider>
    </>
  );
}

export default App;
