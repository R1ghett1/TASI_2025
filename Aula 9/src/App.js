import React from 'react'
import {
    BrowserRouter,
    Routes,
    Link,
    Route,
    Navigate, //Utilizando rota privada
    Outlet //Utilizando em rota privada
    
} from 'react-router-dom'

import Dashboard from './component/Dashboard'
import Produtos from './component/Produtos'
import Pessoas from './component/Pessoas'
import Login from './component/Login'

const Middleware = () => {
    var logado = localStorage.getItem("ALUNO_ITE")

    if (logado)
      return <Outlet/>
    else 
      return <Navigate to="/login"/>
}

const App = () => {
    return (

          <BrowserRouter>
            <nav>
              <Link to="/">Dashboard</Link>
              <Link to="/produtos">Produtos</Link>
              <Link to="/pessoas">Pessoas</Link>
            </nav>
            <Routes>
                  <Route path="/login" element={<Login/>}/>

                  <Route element={<Middleware/>}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route path="/produtos" element={<Produtos/>}/>
                    <Route path="/pessoas" element={<Pessoas/>}/>
                  </Route>
          </Routes>
          </BrowserRouter>
    )
}

export default App