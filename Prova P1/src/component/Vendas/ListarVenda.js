import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Style.css'; 

const ListarVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [vendasPerPage] = useState(10); 

    const token = localStorage.getItem("ALUNO_ITE");
    const usuario = localStorage.getItem("USUARIO_LOGADO");
    const navigate = useNavigate();

    const buscarVendas = useCallback(async () => {
        if (!usuario || !token) {
            alert("Usuário não autenticado. Por favor, faça login.");
            navigate("/login");
            return;
        }

        const API_VENDAS_URL = `https://backend-completo.vercel.app/app/venda`;

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(API_VENDAS_URL, {
                headers: { "Authorization": "Bearer " + token }
            });

            if (Array.isArray(response.data)) {
                setVendas(response.data);
            } else {
                console.error("API de vendas não retornou um array:", response.data);
                setVendas([]);
            }

        } catch (err) {
            console.error("Erro ao buscar vendas:", err);
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setError(`Erro ao buscar vendas: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`);
                    if (err.response.status === 401 || err.response.status === 403) {
                         alert("Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.");
                         navigate("/login");
                    }
                } else if (err.request) {
                    setError("Erro: Nenhuma resposta do servidor de vendas. Verifique a URL da API ou sua conexão.");
                } else {
                    setError(`Erro inesperado ao buscar vendas: ${err.message}`);
                }
            } else {
                setError(`Erro desconhecido ao buscar vendas: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, [usuario, token, navigate]);

    useEffect(() => {
        buscarVendas();
    }, [buscarVendas]);

    const handleDeleteVenda = async (vendaId) => {
        const confirmacao = window.confirm(
            `Você tem certeza que deseja deletar a venda de ID: ${vendaId}? Esta ação é irreversível.`
        );

        if (!confirmacao) {
            return;
        }

        if (!usuario || !token) {
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            navigate("/login");
            return;
        }
        
        const API_DELETE_URL = `https://backend-completo.vercel.app/app/venda`; 

        try {
            const response = await axios.delete(API_DELETE_URL, {
                headers: { "Authorization": "Bearer " + token },
                data: { id: vendaId } 
            });
            

            if (response.status === 200) {
                alert("Venda deletada com sucesso!");
                buscarVendas(); 
            } else {
                alert(`Erro ao deletar venda: ${response.status} - ${response.data?.message || 'Resposta inesperada'}`);
            }
        } catch (err) {
            console.error("Erro ao deletar venda:", err);
            if (axios.isAxiosError(err)) {
                alert(`Erro ao deletar: ${err.response?.status} - ${err.response?.data?.message || JSON.stringify(err.response?.data)}`);
            } else {
                alert(`Erro desconhecido ao deletar: ${err.message}`);
            }
        }
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const indexOfLastVenda = currentPage * vendasPerPage;
    const indexOfFirstVenda = indexOfLastVenda - vendasPerPage;
    const currentVendas = vendas.slice(indexOfFirstVenda, indexOfLastVenda);

    const totalPages = Math.ceil(vendas.length / vendasPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage + 1); 
        }
    };

    return (
        <div className="listar-vendas-container">
            <h1>Listar Vendas</h1>

            {loading && <p className="loading-message">Carregando vendas...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && vendas.length === 0 && (
                <p className="no-sales-message">Nenhuma venda encontrada.</p>
            )}

            {!loading && !error && vendas.length > 0 && (
                <>
                    <table className="vendas-table">
                        <thead>
                            <tr>
                                <th>ID do Pedido</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Ações</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {currentVendas.map(venda => (
                                <tr key={venda._id}>
                                    <td data-label="ID do Pedido">{venda._id}</td>
                                    <td data-label="Cliente">{venda.nomeCliente}</td>
                                    <td data-label="Data">{new Date(venda.data).toLocaleDateString('pt-BR')}</td>
                                    <td data-label="Itens">
                                        {venda.produtos && venda.produtos.length > 0 ? (
                                            <ul>
                                                {venda.produtos.map((item, index) => (
                                                    <li key={index}>
                                                        {item.nome} ({item.quantidade}x) - R$ {formatPrice(item.preco)}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>Nenhum item</span>
                                        )}
                                    </td>
                                    <td data-label="Total">
                                        R$ {formatPrice(venda.produtos.reduce((acc, item) => acc + (item.preco * item.quantidade), 0))}
                                    </td>
                                    <td data-label="Ações"> 
                                        <button 
                                            onClick={() => handleDeleteVenda(venda._id)}
                                            className="btn-deletar" 
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Controles de Paginação */}
                    {totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="btn-pagination"
                            >
                                Anterior
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`btn-pagination ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="btn-pagination"
                            >
                                Próximo
                            </button>
                            <span className="pagination-info">Página {currentPage} de {totalPages}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListarVendas;