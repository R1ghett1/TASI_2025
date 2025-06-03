import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Changed Navigate to useNavigate
import axios from 'axios';
import '../../StyleClient.css';
import Footer from '../../component/Common/Footer';

const VerProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const API_USER_FOR_PUBLIC_PRODUCTS = 'kayky';
    const API_BASE_URL_ALL_PRODUCTS = `https://backend-completo.vercel.app/app/produtos/${API_USER_FOR_PUBLIC_PRODUCTS}`;

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        const fetchAndFilterProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`Buscando TODOS os produtos de: ${API_BASE_URL_ALL_PRODUCTS}`);
                const response = await axios.get(API_BASE_URL_ALL_PRODUCTS);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const foundProduct = response.data.find(p => p._id === id);

                    if (foundProduct) {
                        setProduct(foundProduct);
                    } else {
                        setError("Produto não encontrado na lista de produtos.");
                        setProduct(null);
                    }
                } else {
                    setError("Nenhum produto encontrado na API ou formato de dados inválido.");
                    setProduct(null);
                }

            } catch (err) {
                console.error("Erro ao buscar ou filtrar produtos:", err);
                if (axios.isAxiosError(err)) {
                    if (err.response) {
                        setError(`Erro da API: ${err.response.status} - ${err.response.data?.message || 'Dados inválidos.'}`);
                    } else if (err.request) {
                        setError("Erro de conexão: Nenhuma resposta do servidor. Verifique sua internet.");
                    } else {
                        setError(`Erro inesperado: ${err.message}`);
                    }
                } else {
                    setError(`Erro desconhecido: ${err.message}`);
                }
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAndFilterProduct();
        }
    }, [id, API_BASE_URL_ALL_PRODUCTS]);

    const handleQuantityChange = (amount) => {
        setQuantity(prevQuantity => Math.max(1, prevQuantity + amount));
    };

    const handleAddToCart = () => {
        if (product) {
            // Crie um objeto para o item do carrinho
            const itemToAdd = {
                _id: product._id,
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem, // Inclua a imagem se quiser exibir no carrinho
                quantidade: quantity,
            };

            // 1. Recupere os itens existentes do localStorage
            // O `JSON.parse` converte a string JSON de volta para um array de objetos JavaScript.
            // Se não houver nada no localStorage, ele retorna null, então usamos um array vazio como fallback.
            const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

            // 2. Verifique se o produto já existe no carrinho
            const existingItemIndex = existingCartItems.findIndex(item => item._id === product._id);

            if (existingItemIndex > -1) {
                // Se o produto já existe, atualize a quantidade
                existingCartItems[existingItemIndex].quantidade += quantity;
            } else {
                // Se o produto não existe, adicione-o como um novo item
                existingCartItems.push(itemToAdd);
            }

            // 3. Salve o array atualizado de volta no localStorage
            // O `JSON.stringify` converte o array de objetos JavaScript em uma string JSON,
            // pois o localStorage só pode armazenar strings.
            localStorage.setItem('cartItems', JSON.stringify(existingCartItems));

            alert(`"${product.nome}" (${quantity} unidades) adicionado ao carrinho!`);
            console.log(`Produto adicionado ao carrinho e salvo no localStorage:`, itemToAdd);
            navigate('/produtos'); // Use navigate hook here
        }
    };

    if (loading) {
        return (
            <div id='root'>
                <header className="header product-page-header">
                    <div className="logo-container">
                        <h1 className="logo-text">Detalhes do Produto</h1>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li><Link to="/">Início</Link></li>
                            <li><Link to="/produtos">Produtos</Link></li>
                            <li><Link to="/carrinho">Carrinho</Link></li>
                        </ul>
                    </nav>
                </header>
                <main className="product-detail-main loading-state">
                    <p>Carregando detalhes do produto...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div id='root'>
                <header className="header product-page-header">
                    <div className="logo-container">
                        <h1 className="logo-text">Detalhes do Produto</h1>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li><Link to="/">Início</Link></li>
                            <li><Link to="/produtos">Produtos</Link></li>
                            <li><Link to="/carrinho">Carrinho</Link></li>
                        </ul>
                    </nav>
                </header>
                <main className="product-detail-main error-state">
                    <p className="error-message">{error}</p>
                    <Link to="/produtos" className="btn-primary">Voltar aos Produtos</Link>
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div id='root'>
                <header className="header product-page-header">
                    <div className="logo-container">
                        <h1 className="logo-text">Detalhes do Produto</h1>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li><Link to="/">Início</Link></li>
                            <li><Link to="/produtos">Produtos</Link></li>
                            <li><Link to="/carrinho">Carrinho</Link></li>
                        </ul>
                    </nav>
                </header>
                <main className="product-detail-main not-found-state">
                    <p>Produto não encontrado.</p>
                    <Link to="/produtos" className="btn-primary">Voltar aos Produtos</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div id='root'>
            <header className="header product-page-header">
                <div className="logo-container">
                    <h1 className="logo-text">{product?.nome || 'Detalhes do Produto'}</h1>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/produtos">Produtos</Link></li>
                        <li><Link to="/carrinho">Carrinho</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="product-detail-main">
                <section className="product-detail-container">
                    <div className="product-detail-image">
                        <img
                            src={product?.imagem && product.imagem.startsWith('http') ? product.imagem : 'https://via.placeholder.com/400x400?text=Sem+Imagem'}
                            alt={product?.nome || 'Produto'}
                        />
                    </div>
                    <div className="product-detail-info">
                        <h1 className="product-detail-title">{product?.nome || 'Produto Indisponível'}</h1>
                        <p className="product-detail-category">Categoria: {product?.categoria || 'N/A'}</p>
                        <p className="product-detail-description">{product?.descricao || 'Descrição não disponível.'}</p>
                        <p className="product-detail-price">
                            R$ {
                                product?.preco !== undefined && product.preco !== null && !isNaN(parseFloat(product.preco))
                                    ? parseFloat(product.preco).toFixed(2).replace('.', ',')
                                    : 'Preço indisponível'
                            }
                        </p>

                        <div className="product-quantity-selector">
                            <button onClick={() => handleQuantityChange(-1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)}>+</button>
                        </div>

                        <button className="btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default VerProduto;