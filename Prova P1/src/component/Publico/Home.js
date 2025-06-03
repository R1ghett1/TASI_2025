import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../StyleClient.css';
import Footer from '../../component/Common/Footer';

// Componente reutilizável para o Cartão de Produto
const ProductCard = ({ imageSrc, altText, title, description, price, categoryName, productId }) => {
  return (
    <Link to={`/produto/${productId}`} className="card-link-wrapper">
      <div className="card">
        <img src={imageSrc && imageSrc.startsWith('http') ? imageSrc : 'https://via.placeholder.com/200x200?text=Sem+Imagem'}
          alt={altText || title}
        />
        <h3>{title}</h3>
        <p>{description}</p>
        {price !== undefined && price !== null && (
          <p className="product-price">R$ {parseFloat(price).toFixed(2).replace('.', ',')}</p>
        )}
        {categoryName && <p className="product-category">Categoria: {categoryName}</p>}

        <button className="btn-secondary add-to-cart-card-btn">
          Ver Detalhes
        </button>
      </div>
    </Link>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_USER_FOR_PUBLIC_PRODUCTS = 'kayky';
  const API_BASE_URL_PRODUCTS = `https://backend-completo.vercel.app/app/produtos/${API_USER_FOR_PUBLIC_PRODUCTS}`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Buscando produtos de: ${API_BASE_URL_PRODUCTS}`);
        const productsResponse = await axios.get(API_BASE_URL_PRODUCTS);

        console.log("Dados de produtos recebidos:", productsResponse.data);
        setProducts(productsResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(`Erro ao buscar dados: ${err.response.status} - ${err.response.data?.message || JSON.stringify(err.response.data)}`);
            console.error("Dados do erro da API (response):", err.response.data);
          } else if (err.request) {
            setError("Erro: Nenhuma resposta do servidor. Verifique a URL da API ou sua conexão.");
          } else {
            setError(`Erro inesperado: ${err.message}`);
          }
        } else {
          setError(`Erro inesperado: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_USER_FOR_PUBLIC_PRODUCTS, API_BASE_URL_PRODUCTS]);

  // Função para rolagem suave
  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id='root'>
      <header className="header">
        <div className="logo-container">
          <h1 className="logo-text">R1ghett1</h1>
        </div>
        <nav className="main-nav">
          <ul>
            {/* Links de navegação para seções na mesma página com rolagem suave */}
            <li><a href="#home-banner" onClick={(e) => { e.preventDefault(); handleScrollToSection('home-banner'); }}>Início</a></li>
            <li><a href="#featured-products-section" onClick={(e) => { e.preventDefault(); handleScrollToSection('featured-products-section'); }}>Destaques</a></li>
            <li><Link to="/produtos">Produtos</Link></li> {/* Este continua sendo um Link para outra rota */}
            <li><a href="#about-us-section" onClick={(e) => { e.preventDefault(); handleScrollToSection('about-us-section'); }}>Sobre Nós</a></li>
            <li><Link to="/carrinho">Carrinho</Link></li> {/* Este continua sendo um Link para outra rota */}
          </ul>
        </nav>
      </header>

      <main className="home-container">
        {/* Seção Banner Principal */}
        <section className="banner" id="home-banner">
          <div className="banner-content">
            <h1>Eleve seu desempenho</h1>
            <p>Encontre os melhores produtos para seu treino e viva seu máximo potencial.</p>
            <button className="btn-primary" onClick={() => handleScrollToSection('featured-products-section')}>Explore Agora</button> {/* Botão também rola */}
          </div>
        </section>

        {/* Seção de Produtos em Destaque */}
        <section className="featured-products" id="featured-products-section">
          <h2>Produtos em Destaque</h2>
          <div className="cards">
            {loading && <p>Carregando produtos...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && products.length === 0 && <p>Nenhum produto encontrado para o usuário "{API_USER_FOR_PUBLIC_PRODUCTS}".</p>}

            {!loading && !error && products.slice(0, 5).map(product => (
              <ProductCard
                key={product._id}
                productId={product._id}
                imageSrc={product.imagem}
                altText={product.nome}
                title={product.nome}
                description={product.descricao}
                price={product.preco}
                categoryName={product.categoria}
              />
            ))}
          </div>
        </section>

        {/* Seção "Sobre Nós" */}
        <section className="about-us" id="about-us-section">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=700&q=80"
              alt="Esportista em ação"
            />
          </div>
          <div className="about-text">
            <h2>Sobre a Nossa Loja</h2>
            <p>
              Fundada em 2025, nossa missão é oferecer produtos esportivos que inspiram, motivam e elevam seu desempenho ao máximo. Unimos qualidade, inovação e estilo para proporcionar a melhor experiência para quem busca superar limites e alcançar seus objetivos.
            </p>
            <button className="btn-primary">Veja Nossa História</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;