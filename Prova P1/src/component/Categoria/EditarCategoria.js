import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../Style.css'; // Updated import path

const EditarCategoria = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categoriaNome, setCategoriaNome] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("ALUNO_ITE");
    const usuario = localStorage.getItem("USUARIO_LOGADO");

    useEffect(() => {
        const fetchCategoriaDetails = async () => {
            if (!usuario || !token) {
                alert("Usuário não autenticado. Por favor, faça login.");
                navigate("/login");
                return;
            }

            const API_CATEGORIAS_URL = "https://backend-completo.vercel.app/app/categorias"; 

            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(API_CATEGORIAS_URL, {
                    headers: { "Authorization": "Bearer " + token }
                });

                console.log("Resposta da API /app/categorias:", response.data);

                const categoriaEncontrada = Array.isArray(response.data) 
                    ? response.data.find(cat => String(cat._id) === String(id)) 
                    : null;
                
                console.log("Categoria encontrada para edição (ID:", id, "):", categoriaEncontrada);

                if (categoriaEncontrada) {
                    setCategoriaNome(categoriaEncontrada.nome);
                } else {
                    setError("Categoria não encontrada ou você não tem permissão.");
                    alert("Categoria não encontrada ou você não tem permissão para editá-la.");
                    navigate("/listarcategorias");
                }
            } catch (err) {
                console.error("Erro ao buscar detalhes da categoria:", err);
                if (axios.isAxiosError(err)) {
                    setError(`Erro: ${err.response?.status} - ${err.response?.data?.message || 'Falha ao buscar detalhes da categoria.'}`);
                    if (err.response?.status === 401 || err.response?.status === 403) {
                        alert("Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.");
                        navigate("/login");
                    }
                } else {
                    setError(`Erro desconhecido: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCategoriaDetails();
        } else {
            setError("ID da categoria não fornecido na URL.");
            setLoading(false);
        }
    }, [id, usuario, token, navigate]);

    const handleChange = (e) => {
        setCategoriaNome(e.target.value);
    };

    const handleEditarCategoria = async (e) => {
        e.preventDefault();

        if (!categoriaNome) {
            alert("O nome da categoria não pode ser vazio.");
            return;
        }

        if (!usuario || !token) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            navigate("/login");
            return;
        }
        
        const dadosParaAtualizar = {
            id: id,
            nome_categoria: categoriaNome
        };

        const API_EDIT_URL = "https://backend-completo.vercel.app/app/categorias"; 

        try {
            const response = await axios.put(
                API_EDIT_URL,
                dadosParaAtualizar,
                {
                    headers: { 
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Resposta da API PUT /app/categorias:", response.data);

            if (response.status === 200) {
                alert("Categoria atualizada com sucesso!");
                navigate("/listarcategorias");
            } else {
                alert(`Erro ao atualizar categoria: ${response.status} - ${response.data?.message || 'Resposta inesperada'}`);
            }

        } catch (err) {
            console.error("Erro ao atualizar categoria:", err);
            if (axios.isAxiosError(err)) {
                alert(`Erro do servidor: ${err.response?.status} - ${err.response?.data?.message || JSON.stringify(err.response?.data)}`);
            } else {
                alert(`Erro desconhecido: ${err.message}`);
            }
        }
    };

    if (loading) {
        return <p className="loading-message">Carregando categoria...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="category-form-container"> {/* Updated class name */}
            <h1 className="category-form-title">Editar Categoria</h1> {/* Updated class name */}
            <form onSubmit={handleEditarCategoria} className="category-form"> {/* Updated class name */}
                <div className="form-group">
                    <label htmlFor="categoriaNome">Nome da Categoria:</label>
                    <input
                        type="text"
                        id="categoriaNome"
                        value={categoriaNome} 
                        onChange={handleChange}
                        className="category-form-input"
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary-custom">Atualizar Categoria</button> 
                </div>
            </form>
        </div>
    );
};

export default EditarCategoria;