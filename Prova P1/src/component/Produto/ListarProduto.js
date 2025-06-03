import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../Style.css';

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nome_produto, setNomeProduto] = useState('');

    const token = localStorage.getItem("ALUNO_ITE");
    const usuario = localStorage.getItem("USUARIO_LOGADO");
    const navigate = useNavigate();

    const buscarProdutos = useCallback(async () => {
        if (!usuario || !token) {
            alert("Usuário não autenticado");
            navigate("/login");
            return;
        }
        const urlProdutos = `https://backend-completo.vercel.app/app/produtos/${usuario}${nome_produto ? `/${nome_produto}` : ''}`;
        const urlCategorias = "https://backend-completo.vercel.app/app/categorias";

        try {
            const produtosRes = await axios.get(urlProdutos, {
                headers: { "Authorization": "Bearer " + token }
            });
            const categoriasRes = await axios.get(urlCategorias, {
                headers: { "Authorization": "Bearer " + token }
            });

            setProdutos(produtosRes.data);
            setCategorias(categoriasRes.data);
        } catch (erro) {
            console.error("Erro ao buscar produtos ou categorias:", erro);
            alert("Erro ao buscar produtos ou categorias.");
        }
    }, [usuario, token, nome_produto, navigate]); 

    useEffect(() => {
        buscarProdutos();
    }, [buscarProdutos]);

    const getCategoriaNome = useCallback((categoriaInfo) => {
        if (!categoriaInfo) {
            return 'Categoria não informada';
        }

        const isLikelyId = typeof categoriaInfo === 'string' && categoriaInfo.length === 24 && /^[0-9a-fA-F]+$/.test(categoriaInfo);

        if (isLikelyId) {
            const categoria = categorias.find(cat => String(cat._id) === String(categoriaInfo));
            return categoria ? categoria.nome : 'Categoria não encontrada (ID)';
        } else {
            const categoriaExistePorNome = categorias.some(cat => cat.nome === categoriaInfo);
            return categoriaExistePorNome ? categoriaInfo : 'Categoria não encontrada (Nome)';
        }
    }, [categorias]); 

    const deletarProduto = async (produtoId) => {
        const urlProdutoDeletar = `https://backend-completo.vercel.app/app/produtos`;

        const confirmacao = window.confirm("Tem certeza que deseja deletar este produto?");
        if (!confirmacao) {
            return;
        }

        try {
            await axios.delete(urlProdutoDeletar, {
                headers: { "Authorization": "Bearer " + token },
                data: { id: produtoId }
            });
            alert("Produto deletado com sucesso!");
            buscarProdutos(); 
        } catch (erro) {
            console.error("Erro ao deletar produto:", erro);
            alert("Erro ao deletar produto.");
        }
    };

    return (
        <div className="tabela-container">
            <h1>Listar Produtos</h1>

            <input
                type="text"
                placeholder="Nome do produto"
                value={nome_produto}
                onChange={(e) => setNomeProduto(e.target.value)}
                className="input-search-produto" 
            />

            <table className="tabela-produtos">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço</th>
                        <th>Categoria</th>
                        <th>Descrição</th>
                        <th>Imagem</th>
                        <th>Usuário</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.length === 0 ? (
                        <tr>
                            <td colSpan="9">Nenhum produto encontrado.</td>
                        </tr>
                    ) : (
                        produtos.map((produto) => (
                            <tr key={produto._id}>
                                <td>{produto._id}</td>
                                <td>{produto.nome}</td>
                                <td>{produto.quantidade}</td>
                                <td>R$ {parseFloat(produto.preco).toFixed(2).replace('.', ',')}</td>
                                <td>{getCategoriaNome(produto.categoria)}</td> 
                                <td>{produto.descricao}</td>
                                <td>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50x50?text=Sem+Imagem'; }} 
                                    />
                                </td>
                                <td>{produto.usuario}</td>
                                <td>
                                    <button
                                        className="btn-editar"
                                        onClick={() => navigate(`/editarproduto/${produto._id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-deletar"
                                        onClick={() => deletarProduto(produto._id)}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListarProdutos;