import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; //Retira o cache do css vindo por padrão
import MenuPrincipal from './template/MenuPrincipal';

const tema = createTheme({
  palette: {
    mode:'dark',
    primary: {
      main: '#fff5252'
    },
  },
})

const App = () => {
  return (
    <ThemeProvider theme={tema}>
      <CssBaseline/>
        <MenuPrincipal/>
    </ThemeProvider>
  );
};

export default App;
