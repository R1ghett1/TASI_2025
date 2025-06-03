import React from 'react';
import ReactDOM from 'react-dom/client';
//importando algo de fora da node_modules
//import Produto from './components/produto.js'

const root = ReactDOM.createRoot(document.getElementById('root'));


//<Texto/> chama o componente da função Texto()
root.render(
  <React.StrictMode>
      <Texto/>
  </React.StrictMode>
);

//Todo componente tem que ser maiúsculo
//Return só retorna um componente 
//Pode existir conter uma div, com vários H1 
//Podendo usar um body para colocar vários elementos dentro 

function Texto() {

  var [ valor, setValor] = React.useState(); 
  function mudarValor(e) {
    setValor(e.target.value * 5)
  }
    return(
           <div>
              <input type="text" onChange={ (e) => mudarValor(e)}/>

              <span>{ valor }</span>
              <hr/>
           </div>
    )
}

