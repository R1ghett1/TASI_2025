import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
//importando algo de fora da node_modules
//import Produto from './components/produto.js'

const root = ReactDOM.createRoot(document.getElementById('root'));


//<Texto/> chama o componente da função Texto()
root.render(
  <React.StrictMode>
      <App/>
  </React.StrictMode>
);




