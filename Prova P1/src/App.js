// src/App.js
import React, { useState, useEffect } from 'react';
import { useLocation, Link, Outlet, Navigate, Routes, Route, BrowserRouter } from 'react-router-dom';

// Importações de componentes (mantidos os seus)
import CriarCategoria from './component/Categoria/CriarCategoria';
import Login from './component/Login';
import Registrar from './component/Registrar';
import ListarCategorias from './component/Categoria/ListarCategoria';
import CriarProduto from './component/Produto/CriarProduto';
import ListarProduto from './component/Produto/ListarProduto';
import EditarProduto from './component/Produto/EditarProduto';
import Home from './component/Publico/Home';
import Produtos from './component/Publico/Produtos'; 
import Carrinho from './component/Publico/Carrinho';
import VerProduto from './component/Publico/VerProduto';
import LimparDados from './component/Admin/LimparDados';
import Checkout from './component/Publico/Checkout';
import ListarVendas from './component/Vendas/ListarVenda';
import EditarCategoria from './component/Categoria/EditarCategoria';


// --- Middleware para Rotas Protegidas ---
const Middleware = () => {
    const logado = localStorage.getItem("ALUNO_ITE");
    // Se não estiver logado, redireciona para a página de login
    return logado ? <Outlet /> : <Navigate to="/login" />;
};

// --- Componente Principal que Contém a Lógica do Menu e Rotas ---
const AppContent = () => {
    const location = useLocation();
    const rotaAtual = location.pathname;

    // Rotas públicas onde o menu NÃO deve aparecer
    // Usamos uma verificação mais robusta para a rota '/produto/:id'
    const isPublicRoute = (path) => {
        const publicPaths = ["/login", "/registrar", "/home", "/", "/produtos", "/carrinho", "/checkout"];
        // Verifica se é um dos caminhos exatos OU se começa com "/produto/"
        return publicPaths.includes(path) || path.startsWith("/produto/");
    };

    // Estado para controle do menu e submenus
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [subMenuProduto, setSubMenuProduto] = useState(false);
    const [subMenuCategoria, setSubMenuCategoria] = useState(false);
    const [subMenuVendas, setSubMenuVendas] = useState(false);
    const [subMenuAuth, setSubMenuAuth] = useState(false);
    const [subMenuHome, setSubMenuHome] = useState(false); 

    useEffect(() => {
        setMostrarMenu(false);
        setSubMenuProduto(false);
        setSubMenuCategoria(false);
        setSubMenuVendas(false);
        setSubMenuAuth(false);
        setSubMenuHome(false); 
    }, [rotaAtual]);

    // Verifica se a rota atual é pública para controlar a visibilidade do menu
    const isCurrentRoutePublic = isPublicRoute(rotaAtual);

    return (
        <section id="container" className={isCurrentRoutePublic ? "sem-menu" : ""}>
            {/* Renderiza o menu lateral apenas se a rota NÃO for pública */}
            {!isCurrentRoutePublic && (
                <nav id="containerMenu">
                    <button id="btnPrincipal" onClick={() => setMostrarMenu(prev => !prev)}>
                        Menu
                    </button>

                    {mostrarMenu && (
                        <div id="menuForm">
                            <button onClick={() => setSubMenuHome(prev => !prev)}>Home</button>
                            {subMenuHome && (
                                <div id="menuSub">
                                    {/* Link para a Home pública do cliente */}
                                    <Link to="/home">- Página Cliente</Link><br />
                                </div>
                            )}

                            <button onClick={() => setSubMenuProduto(prev => !prev)}>Produto</button>
                            {subMenuProduto && (
                                <div id="menuSub">
                                    <Link to="/criarproduto">- Criar Produtos</Link><br />
                                    <Link to="/listarproduto">- Listar Produtos</Link><br />
                                </div>
                            )}

                            <button onClick={() => setSubMenuCategoria(prev => !prev)}>Categoria</button>
                            {subMenuCategoria && (
                                <div id="menuSub">
                                    <Link to="/criarcategoria">- Criar Categoria</Link><br />
                                    <Link to="/listarcategorias">- Listar Categorias</Link><br />
                                </div>
                            )}

                             <button onClick={() => setSubMenuVendas(prev => !prev)}>Vendas</button>
                            {subMenuVendas && (
                                <div id="menuSub">
                                    <Link to="/listarvendas">- Listar Vendas</Link><br />
                                </div>
                            )}

                            <button onClick={() => setSubMenuAuth(prev => !prev)}>Autenticação</button>
                            {subMenuAuth && (
                                <div id="menuSub">
                                    <Link to="/login">- Login</Link><br />
                                    <Link to="/registrar">- Registrar</Link>
                                </div>
                            )}
                            {/* Você pode adicionar um botão de Logout aqui para rotas protegidas */}
                            {/*
                            <button onClick={() => {
                                localStorage.removeItem("ALUNO_ITE");
                                localStorage.removeItem("USUARIO_LOGADO");
                                setMostrarMenu(false); // Fechar menu após logout
                                window.location.href = '/login'; // Redireciona para o login
                            }}>
                                Logout
                            </button>
                            */}
                        </div>
                    )}
                </nav>
            )}
            <main id="conteudoPrincipal">
                <Routes>
                    <Route path="/produto/:id" element={<VerProduto />} />

                
                    <Route path="/login" element={<Login />} />
                    <Route path="/registrar" element={<Registrar />} />
                    <Route path="/home" element={<Home />} /> 
                    <Route path="/produtos" element={<Produtos />} /> 
                    <Route path="/carrinho" element={<Carrinho />} /> 
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/" element={<Home/>} /> 
                    
        
                    <Route element={<Middleware />}>
                        <Route path="/limpardados" element={<LimparDados />} />
                        <Route path="/listarproduto" element={<ListarProduto />} />
                        <Route path="/criarproduto" element={<CriarProduto />} />
                        <Route path="/editarproduto/:id" element={<EditarProduto />} />
                        <Route path="/criarcategoria" element={<CriarCategoria />} />
                        <Route path="/editarcategoria/:id" element={<EditarCategoria />} /> 
                        <Route path="/listarcategorias" element={<ListarCategorias />} />
                        <Route path="/listarvendas" element={<ListarVendas />} /> 
                    </Route>
                </Routes>
            </main>
        </section>
    );
};

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;