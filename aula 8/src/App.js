import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { Container, Grid, CssBaseline, ThemeProvider, createTheme } from "@mui/material"; 
import Personagem from "./components/Personagem"; 

const tema = createTheme({
  palette: {
    mode: "dark", 
    primary: {
      main: "#ff5252", 
    },
  },
});

const App = () => {
  const [characters, setCharacters] = useState([]); 

  useEffect(() => {
    axios.get("https://rickandmortyapi.com/api/character").then((response) => {setCharacters(response.data.results);}).catch((error) => {console.error("Erro ao buscar dados:", error); 
});
  }, []); 

  return (
    <ThemeProvider theme={tema}> {/* Aplicando o tema customizado */}
      <CssBaseline /> {/* Garante que o tema escuro seja aplicado corretamente */}
      <Container>
        <Grid container spacing={3} justifyContent="center">
          {characters.map((char) => (
            <Grid item key={char.id}> {/* Cada personagem é renderizado como um item da grade */}
              <Personagem
                nome={char.name}
                image={char.image}
                especie={char.species}
                status={char.status}
                origem={char.origin.name}
                genero={char.gender}
                criacao={char.created}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
