import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../Style.css';

const ListarCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const token = localStorage.getItem("ALUNO_ITE");
    const navigate = useNavigate();

    const buscarCategorias = async () => {
        const url = "https://backend-completo.vercel.app/app/categorias";

        try {
            const retorno = await axios.get(url, {
                headers: { "Authorization": "Bearer " + token }
            });
            setCategorias(retorno.data);
        } catch (erro) {
            console.error("Erro ao buscar categorias", erro);
            alert("Erro ao buscar categorias");
        }
    };

    useEffect(() => {
        buscarCategorias();
    }, []);

    const deletarCategoria = async (categoriaId) => {
        const url = "https://backend-completo.vercel.app/app/categorias";

        try {
            await axios.delete(url, {
                headers: { "Authorization": "Bearer " + token },
                data: { id: categoriaId }
            });
            alert("Categoria deletada com sucesso!");
            buscarCategorias(); 
        } catch (erro) {
            console.error("Erro ao deletar categoria", erro);
            alert("Erro ao deletar categoria");
        }
    };

    return (
        <div className="tabela-container">
            <h1>Listar Categorias</h1>
            <table className="tabela-produtos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria._id}>
                            <td>{categoria._id}</td>
                            <td>{categoria.nome}</td>
                            <td>
                                <button 
                                    className="btn-editar" 
                                    onClick={() => navigate(`/editarcategoria/${categoria._id}`)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="btn-deletar" 
                                    onClick={() => deletarCategoria(categoria._id)}
                                >
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarCategorias;
