import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../Style.css';

const CriarProduto = () => {
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem, setImagem] = useState("");
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const resposta = await axios.get("https://backend-completo.vercel.app/app/categorias", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("ALUNO_ITE")}`
                    }
                });

                console.log("Categorias recebidas:", resposta.data);
                setCategorias(resposta.data); 
            } catch (erro) {
                console.error("Erro ao carregar categorias", erro);
                alert("Erro ao carregar categorias");
            }
        };

        fetchCategorias();
    }, []);

    const criarProduto = async () => {
        const url = "https://backend-completo.vercel.app/app/produtos";
        const dados = {
            nome,
            quantidade,
            preco,
            categoria,
            descricao,
            imagem
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
                alert("Produto criado com sucesso!");
                 navigate("/listarproduto");
            }
        } catch (erro) {
            console.error("Erro ao criar o produto", erro);
            alert("Erro ao criar o produto");
        }
    };

    return (
    <div className="editar-produto__container">
        <h2 className="editar-produto__titulo">Criar Produto</h2>

        <input
            type="text"
            className="editar-produto__input"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
        />
        <input
            type="text"
            className="editar-produto__input"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
        />
        <input
            type="text"
            className="editar-produto__input"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
        />
        <select
            className="editar-produto__select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
        >
            <option value="">Selecione uma categoria</option>
            {Array.isArray(categorias) && categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.nome}
                </option>
            ))}
        </select>
        <input
            type="text"
            className="editar-produto__input"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
        />
        <input
            type="text"
            className="editar-produto__input"
            placeholder="Imagem"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
        />
        <button className="editar-produto__botao" onClick={criarProduto}>
            Criar Produto
        </button>
    </div>
    );
};

export default CriarProduto;
