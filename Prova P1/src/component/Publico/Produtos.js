import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../StyleClient.css';
import Footer from '../../component/Common/Footer';

// Componente ProductCard permanece o mesmo
const ProductCard = ({ productId, imageSrc, altText, title, description, price, categoryName }) => {
    const formatPrice = (value) => {
        return parseFloat(value).toFixed(2).replace('.', ',');
    };

    return (
        <Link to={`/produto/${productId}`} className="card-link">
            <div className="card">
                <img
                    src={imageSrc && imageSrc.startsWith('http') ? imageSrc : 'https://via.placeholder.com/200x200?text=Sem+Imagem'}
                    alt={altText || title}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/200x200?text=Sem+Imagem'; }} // Fallback para imagem
                />
                <h3>{title}</h3>
                <p className="product-description-card">{description}</p>
                {price !== undefined && price !== null && (
                    <p className="product-price">R$ {formatPrice(price)}</p>
                )}
                {/* categoryName já virá como o nome correto da categoria, traduzido pela função getCategoryName */}
                {categoryName && <p className="product-category">Categoria: {categoryName}</p>}
                <button className="btn-secondary">Ver Detalhes</button>
            </div>
        </Link>
    );
};

const Produtos = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categorias, setCategorias] = useState([]); // **Novo estado para armazenar as categorias**

    // Estados de paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    const API_USER_FOR_PUBLIC_PRODUCTS = 'kayky';
    const API_BASE_URL_PRODUCTS = `https://backend-completo.vercel.app/app/produtos/${API_USER_FOR_PUBLIC_PRODUCTS}`;
    const API_BASE_URL_CATEGORIES = `https://backend-completo.vercel.app/app/categorias`; // **URL para buscar categorias**

    // **useEffect para buscar produtos E categorias no carregamento**
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Busca produtos e categorias em paralelo usando Promise.all
                const [productsResponse, categoriesResponse] = await Promise.all([
                    axios.get(API_BASE_URL_PRODUCTS),
                    axios.get(API_BASE_URL_CATEGORIES), // Busca as categorias
                ]);

                setProducts(productsResponse.data);
                setFilteredProducts(productsResponse.data);

                // Garante que categoriesResponse.data é um array antes de setar o estado
                if (Array.isArray(categoriesResponse.data)) {
                    setCategorias(categoriesResponse.data); // Salva as categorias no estado
                } else {
                    console.error("API de categorias não retornou um array:", categoriesResponse.data);
                    setCategorias([]); // Define como array vazio para evitar erros
                }

            } catch (err) {
                console.error("Erro ao buscar dados na página de Produtos:", err);
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        setError(`Erro ao buscar dados: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`);
                    } else if (err.request) {
                        setError("Erro: Nenhuma resposta do servidor. Verifique a URL da API ou sua conexão.");
                    } else {
                        setError(`Erro inesperado: ${err.message}`);
                    }
                } else {
                    setError(`Erro desconhecido: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [API_USER_FOR_PUBLIC_PRODUCTS, API_BASE_URL_PRODUCTS, API_BASE_URL_CATEGORIES]);

    // **Função getCategoryName: traduz ID da categoria para nome (mesma lógica de ListarProdutos)**
    const getCategoryName = useCallback((categoryInfo) => {
        if (!categoryInfo) {
            return 'Não Especificada';
        }

        // Adiciona checagem para garantir que 'categorias' é um array antes de chamar .find()
        // Isso previne o erro "categorias.find is not a function" no primeiro render
        if (!Array.isArray(categorias) || categorias.length === 0) {
            // Se categorias ainda não foi carregado ou não é um array,
            // tentamos retornar a própria categoryInfo se for uma string curta,
            // ou um fallback, para não quebrar a aplicação.
            if (typeof categoryInfo === 'string' && categoryInfo.length < 20 && !/[0-9]/.test(categoryInfo)) {
                 return categoryInfo; // Parece um nome e categorias ainda não carregou
            }
            return 'Carregando Categoria...'; // Fallback temporário
        }

        // Tenta encontrar a categoria pelo ID (assumindo IDs de 24 caracteres hexadecimais do MongoDB)
        const isLikelyId = typeof categoryInfo === 'string' && categoryInfo.length === 24 && /^[0-9a-fA-F]+$/.test(categoryInfo);

        if (isLikelyId) {
            const foundCategory = categorias.find(cat => String(cat._id) === String(categoryInfo));
            return foundCategory ? foundCategory.nome : 'Outros'; // Retorna 'Outros' se ID não for encontrado
        } else {
            // Se não parece um ID, assume que já é o nome da categoria
            // Você pode adicionar uma validação extra aqui se o nome existe nas categorias
            return categoryInfo;
        }
    }, [categorias]); // Esta função depende do estado 'categorias'

    // **useEffect para filtrar produtos (agora usa o nome da categoria traduzido para busca)**
    useEffect(() => {
        let currentFilteredProducts = products;

        if (searchTerm) {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            currentFilteredProducts = currentFilteredProducts.filter(product =>
                (product.nome && product.nome.toLowerCase().includes(lowercasedSearchTerm)) ||
                (product.descricao && product.descricao.toLowerCase().includes(lowercasedSearchTerm)) ||
                // **Ajuste na busca: agora busca pelo nome da categoria traduzido**
                (getCategoryName(product.categoria) && getCategoryName(product.categoria).toLowerCase().includes(lowercasedSearchTerm))
            );
        }

        setFilteredProducts(currentFilteredProducts);
        setCurrentPage(1);

    }, [searchTerm, products, getCategoryName]); // getCategoryName é uma dependência porque é usada aqui

    // Lógica de paginação
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div id='root'>
            <header className="header product-page-header">
                <div className="logo-container">
                    <h1 className="logo-text">R1ghett1 Produtos</h1>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/produtos">Produtos</Link></li>
                        <li><Link to="/carrinho">Carrinho</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="home-container product-page-main">
                <section className="product-hero">
                    <div className="product-hero-content">
                        <h1>Descubra Nossos Produtos</h1>
                        <p>Encontre o equipamento perfeito para o seu desafio.</p>
                        <div className="search-bar-container">
                            <input
                                type="text"
                                placeholder="Buscar por nome, categoria ou descrição..."
                                className="product-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="product-search-button">Buscar</button>
                        </div>
                    </div>
                </section>

                <section className="all-products-grid" id="all-products">
                    <h2>Todos os Produtos</h2>
                    <div className="cards product-grid-layout">
                        {loading && <p>Carregando produtos...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && filteredProducts.length === 0 && (
                            <p>Nenhum produto encontrado que corresponda à busca.</p>
                        )}

                        {!loading && !error && currentProducts.map(product => (
                            <ProductCard
                                key={product._id}
                                productId={product._id}
                                imageSrc={product.imagem}
                                altText={product.nome}
                                title={product.nome}
                                description={product.descricao}
                                price={product.preco}
                                categoryName={(product.categoria)}
                            />
                        ))}
                    </div>

                    {/* Controles de Paginação */}
                    {!loading && !error && filteredProducts.length > productsPerPage && (
                        <div className="pagination-controls">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className="btn-pagination"
                            >
                                Anterior
                            </button>
                            <span className="pagination-info">Página {currentPage} de {totalPages}</span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className="btn-pagination"
                            >
                                Próximo
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default Produtos;