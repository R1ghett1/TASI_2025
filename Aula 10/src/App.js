import React from 'react';
import {
    BrowserRouter,
    Routes,
    Link,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';

import Dashboard from './component/Dashboard';
import Produtos from './component/Produtos';
import Pessoas from './component/Pessoas';
import Login from './component/Login';
import Registrar from './component/Registrar';

const Middleware = () => {
    var logado = localStorage.getItem("ALUNO_ITE");
    return logado ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/registrar">Registrar</Link>
                <Link to="/">Dashboard</Link>
                <Link to="/produtos">Produtos</Link>
                <Link to="/pessoas">Pessoas</Link>
            </nav>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route element={<Middleware />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/produtos" element={<Produtos />} />
                    <Route path="/pessoas" element={<Pessoas />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
