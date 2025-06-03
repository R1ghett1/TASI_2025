import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../Style.css';

const CriarCategoria = () => {
    const [nome_categoria, setNomeCategoria] = useState("");
    const navigate = useNavigate();

    const criaCategoria = async () => {
        const url = "https://backend-completo.vercel.app/app/categorias";
        const dados = {
            nome_categoria,
        };

        const token = localStorage.getItem("ALUNO_ITE");

        try {
            const retorno = await axios.post(url, dados, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (retorno.data.error) {
                alert(retorno.data.error);
            } else {
                alert("Categoria criada com sucesso!");
                navigate("/listarcategorias");
            }
        } catch (erro) {
            console.error("Erro ao registrar a categoria", erro);
            alert("Erro ao registrar a categoria");
        }
    };

    return (
    <div className="editar-produto__container">
        <h2 className="editar-produto__titulo">Criar Categoria</h2>
        <label className="editar-produto__label" htmlFor="nome_categoria">
            Nome da categoria
        </label>
        <input
            id="nome_categoria"
            type="text"
            className="editar-produto__input"
            placeholder="Nome da categoria"
            value={nome_categoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
        />
        <button className="editar-produto__botao" onClick={criaCategoria}>
            Criar Categoria
        </button>
    </div>
);

}

export default CriarCategoria;
