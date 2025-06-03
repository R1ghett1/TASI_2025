import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../StyleClient.css';
import Footer from '../../component/Common/Footer';

const Carrinho = () => {
    // 1. Inicializa o estado 'cartItems' lendo do localStorage
    // A função é passada para useState para garantir que a leitura ocorra apenas uma vez na montagem inicial.
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem('cartItems');
            // Se houver itens armazenados, faz o parse de volta para objeto JavaScript.
            // Caso contrário, retorna um array vazio.
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error("Erro ao ler cartItems do localStorage:", error);
            // Em caso de erro (ex: JSON inválido), retorna um array vazio para evitar quebrar a aplicação.
            return [];
        }
    });

    // 2. Efeito colateral para persistir 'cartItems' no localStorage sempre que ele mudar
    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Erro ao salvar cartItems no localStorage:", error);
        }
    }, [cartItems]); // O efeito é executado sempre que 'cartItems' é atualizado

    // Calcula o subtotal do carrinho
    // Usa as propriedades 'preco' e 'quantidade' dos itens armazenados.
    const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    // Simula um valor de frete
    const shipping = subtotal > 0 ? 25.00 : 0; // Exemplo: frete de R$ 25 se houver itens
    
    // Calcula o total
    const total = subtotal + shipping;

    // Função para atualizar a quantidade de um item no carrinho
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return; // Quantidade mínima é 1

        setCartItems(prevItems =>
            prevItems.map(item =>
                // Compara pelo '_id' do item, que é o ID gerado pelo backend
                item._id === id ? { ...item, quantidade: newQuantity } : item
            )
        );
    };

    // Função para remover um item do carrinho
    const removeItem = (id) => {
        // Filtra os itens, removendo o que tem o '_id' correspondente
        setCartItems(prevItems => prevItems.filter(item => item._id !== id));
    };

    // Função auxiliar para formatar valores monetários em PT-BR
    const formatPrice = (price) => {
        return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div id='root'>
            <header className="header product-page-header">
                <div className="logo-container">
                    <h1 className="logo-text">Seu Carrinho</h1>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/produtos">Produtos</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="cart-page-main">
                <section className="cart-hero">
                    <div className="cart-hero-content">
                        <h1>Seu Carrinho de Compras</h1>
                        <p>Revise seus itens antes de finalizar a compra.</p>
                    </div>
                </section>

                <section className="cart-details-section">
                    {/* Condição para exibir mensagem de carrinho vazio ou os itens */}
                    {cartItems.length === 0 ? (
                        <div className="empty-cart-message">
                            <p>Seu carrinho está vazio.</p>
                            <Link to="/produtos" className="btn-primary">Explorar Produtos</Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list">
                                {cartItems.map(item => (
                                    <div key={item._id} className="cart-item-card"> {/* Usa item._id como key */}
                                        <img
                                            // Usa item.imagem e um placeholder se não houver
                                            src={item.imagem || 'https://via.placeholder.com/100x100?text=Produto'}
                                            alt={item.nome}
                                            className="cart-item-image"
                                        />
                                        <div className="cart-item-info">
                                            <h3>{item.nome}</h3> {/* Exibe item.nome */}
                                            <p className="cart-item-price">R$ {formatPrice(item.preco)}</p> {/* Exibe item.preco formatado */}
                                        </div>
                                        <div className="cart-item-quantity-controls">
                                            <button onClick={() => updateQuantity(item._id, item.quantidade - 1)}>-</button>
                                            <span>{item.quantidade}</span> {/* Exibe item.quantidade */}
                                            <button onClick={() => updateQuantity(item._id, item.quantidade + 1)}>+</button>
                                        </div>
                                        <button className="cart-item-remove-btn" onClick={() => removeItem(item._id)}>Remover</button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary-box">
                                <h2>Resumo do Pedido</h2>
                                <div className="summary-line">
                                    <span>Subtotal:</span>
                                    <span>R$ {formatPrice(subtotal)}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Frete:</span>
                                    <span>{shipping > 0 ? `R$ ${formatPrice(shipping)}` : 'Grátis'}</span>
                                </div>
                                <div className="summary-line total-line">
                                    <span>Total:</span>
                                    <span>R$ {formatPrice(total)}</span>
                                </div>
                                <Link to="/checkout" className="btn-primary checkout-btn">Finalizar Compra</Link>
                                <Link to="/produtos" className="btn-secondary continue-shopping-btn">Continuar Comprando</Link>
                            </div>
                        </>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Carrinho;