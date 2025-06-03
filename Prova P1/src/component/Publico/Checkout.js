import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../StyleClient.css';
import Footer from '../../component/Common/Footer';

const Checkout = () => {
    const navigate = useNavigate();

    const [nomeComprador, setNomeComprador] = useState('');
    const [emailComprador, setEmailComprador] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cep, setCep] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('pix');

    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCartItems = localStorage.getItem('cartItems');
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            // Em caso de erro ao ler do localStorage, retorna um array vazio.
            // O console.error pode ser útil para depuração, mas não vamos parar a aplicação.
            console.error("Erro ao ler cartItems do localStorage na tela de Checkout:", error);
            return [];
        }
    });

    const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const shipping = subtotal > 0 ? 25.00 : 0;
    const total = subtotal + shipping;

    // A LÓGICA AQUI CAUSA O PROBLEMA:
    // Este useEffect dispara *sempre* que cartItems muda,
    // o que inclui quando ele é zerado APÓS a compra.
    // Precisamos de uma forma de desativar isso para o caso de sucesso.
    useEffect(() => {
        // Verifica se o carrinho está vazio APENAS se não houver um fluxo de compra bem-sucedido recente
        // Ou se o usuário chegou nesta página com o carrinho já vazio.
        // Adicionamos uma condição para evitar o redirecionamento após uma compra bem-sucedida.
        // A melhor forma é garantir que este useEffect só rode quando o usuário *chega* à página
        // e o carrinho está vazio, não quando o carrinho é *esvaziado* após o pedido.
        // Uma flag como 'orderPlaced' ou a remoção da dependência 'cartItems' aqui pode ajudar.
        // Para a sua necessidade de apenas não voltar para o carrinho após o pedido,
        // vamos refatorar a lógica para que o redirecionamento para o carrinho
        // só aconteça se a página for carregada e o carrinho *já* estiver vazio.
        // Se a lógica é que o checkout SÓ pode ser acessado com itens, este useEffect deve ser mantido
        // para a montagem inicial. O problema é a dependência em `cartItems` após a compra.

        // Uma solução é usar um ref para controlar se a navegação foi intencional (por sucesso da compra)
        // ou se o carrinho realmente estava vazio ao acessar.
        // Por simplicidade, vou refatorar a condição para se concentrar no carregamento inicial.

        // Se o carrinho está vazio (ou se a leitura do localStorage falhou e retornou []),
        // e não há itens guardados no localStorage, então redireciona.
        // Isso evita que o redirecionamento ocorra após o carrinho ser limpo por uma compra.
        const storedCartItemsCheck = localStorage.getItem('cartItems');
        if (cartItems.length === 0 && (!storedCartItemsCheck || JSON.parse(storedCartItemsCheck).length === 0)) {
            alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!');
            navigate('/carrinho');
        }
    }, [navigate]); // Remover cartItems daqui faz com que ele rode apenas na montagem.


    const formatPrice = (price) => {
        return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Não há itens no carrinho para finalizar a compra.');
            navigate('/carrinho');
            return;
        }

        if (!nomeComprador || !emailComprador || !endereco || !cidade || !estado || !cep || !metodoPagamento) {
            alert('Por favor, preencha todos os dados e selecione um método de pagamento.');
            return;
        }

        const produtosParaAPI = cartItems.map(item => ({
            nome: item.nome,
            quantidade: item.quantidade,
            preco: parseFloat(item.preco)
        }));

        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];

        const dadosDoPedido = {
            nomeCliente: nomeComprador,
            usuario: 'kayky',
            data: dataFormatada,
            produtos: produtosParaAPI
        };

        try {
            const API_PEDIDOS_URL = 'https://backend-completo.vercel.app/app/venda';

            const response = await axios.post(
                API_PEDIDOS_URL,
                dadosDoPedido,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                alert('Pedido realizado com sucesso!');
                // Esvaziar o carrinho APÓS o sucesso da API
                localStorage.removeItem('cartItems');
                setCartItems([]);
                // NAVEGAR PARA A HOME PELA ÚLTIMA VEZ, sem que o useEffect interfira
                navigate('/home');
            } else {
                alert(`Erro ao finalizar pedido: ${response.data?.message || 'Resposta inesperada do servidor.'}`);
            }

        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    alert(`Erro do servidor ao finalizar pedido: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    alert("Erro: Nenhuma resposta do servidor ao finalizar pedido. Verifique a URL da API ou sua conexão.");
                } else {
                    alert(`Erro inesperado ao finalizar pedido: ${error.message}`);
                }
            } else {
                alert(`Erro desconhecido ao finalizar pedido: ${error.message}`);
            }
        }
    };

    return (
        <div id='root'>
            <header className="header product-page-header">
                <div className="logo-container">
                    <h1 className="logo-text">Checkout</h1>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/produtos">Produtos</Link></li>
                        <li><Link to="/carrinho">Carrinho</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="checkout-page-main">
                <section className="checkout-hero">
                    <div className="checkout-hero-content">
                        <h1>Finalizar Compra</h1>
                        <p>Insira seus dados para prosseguir com o pagamento.</p>
                    </div>
                </section>

                <section className="checkout-form-section">
                    <form onSubmit={handleFinalizarCompra} className="checkout-form">
                        <h2>Dados do Comprador</h2>
                        <div className="form-group">
                            <label htmlFor="nomeComprador">Nome Completo:</label>
                            <input
                                type="text"
                                id="nomeComprador"
                                value={nomeComprador}
                                onChange={(e) => setNomeComprador(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailComprador">Email:</label>
                            <input
                                type="email"
                                id="emailComprador"
                                value={emailComprador}
                                onChange={(e) => setEmailComprador(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endereco">Endereço:</label>
                            <input
                                type="text"
                                id="endereco"
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                                placeholder="Rua, número, complemento"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cidade">Cidade:</label>
                            <input
                                type="text"
                                id="cidade"
                                value={cidade}
                                onChange={(e) => setCidade(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estado">Estado:</label>
                            <input
                                type="text"
                                id="estado"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cep">CEP:</label>
                            <input
                                type="text"
                                id="cep"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                required
                                pattern="\d{5}-?\d{3}"
                                title="Formato CEP: 12345-678 ou 12345678"
                            />
                        </div>

                        <h2>Método de Pagamento</h2>
                        <div className="form-group">
                            <label htmlFor="metodoPagamento">Escolha uma opção:</label>
                            <select
                                id="metodoPagamento"
                                value={metodoPagamento}
                                onChange={(e) => setMetodoPagamento(e.target.value)}
                                required
                            >
                                <option value="pix">Pix</option>
                                <option value="cartao-credito">Cartão de Crédito</option>
                                <option value="boleto">Boleto</option>
                            </select>
                        </div>
                        {metodoPagamento === 'cartao-credito' && (
                            <div className="payment-details-card">
                                <div className="form-group">
                                    <label htmlFor="numeroCartao">Número do Cartão:</label>
                                    <input type="text" id="numeroCartao" placeholder="**** **** **** ****" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nomeCartao">Nome no Cartão:</label>
                                    <input type="text" id="nomeCartao" required />
                                </div>
                                <div className="form-group form-group-inline">
                                    <div>
                                        <label htmlFor="validade">Validade:</label>
                                        <input type="text" id="validade" placeholder="MM/AA" required />
                                    </div>
                                    <div>
                                        <label htmlFor="cvv">CVV:</label>
                                        <input type="text" id="cvv" placeholder="***" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="checkout-summary-final">
                            <h3>Total do Pedido: R$ {formatPrice(total)}</h3>
                        </div>

                        <button type="submit" className="btn-primary checkout-final-btn">Comprar Agora</button>
                        <Link to="/carrinho" className="btn-secondary back-to-cart-btn">Voltar ao Carrinho</Link>
                    </form>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Checkout;