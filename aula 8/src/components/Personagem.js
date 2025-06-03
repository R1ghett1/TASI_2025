import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


export default function Personagem({ nome, image, especie, status, origem, genero, criacao}) {
  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}> {/* Define o tamanho máximo do card e adiciona margem */}
      <CardMedia sx={{ width: 300, height: 300 }} image={image} title={nome} /> {/* Imagem do personagem */}
      <CardContent>
        <Typography gutterBottom variant="h5"> {/*Nome*/}
          {nome}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Espécie: {especie} {/* Espécie do personagem */}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Status: {status} {/* Status de vida do personagem */}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Origem: {origem} {/* Local de origem do personagem */}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          genero: {genero} {/* Genero do personagem */}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          criação: {criacao} {/* Data da criação do personagem */}
        </Typography>
      </CardContent>
    </Card>
  );
}
