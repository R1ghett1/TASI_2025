import React from 'react'

//Function App() {} 

//Componente APP
const App = () => {

    var [valor, setValor] = React.useState()
    var numero = 4
    numero = numero * 8

    const click = () => {
        numero = numero + 10;
        setValor(valor + 1)
        console.log(numero)
    }


    return(
    <div>
        <h1>&copy;Righetti</h1>
        <p>{numero}</p>
        <input type="button" value="clique aqui" onClick={ () => {click()} }/>
        <h3>{valor}</h3>
    </div>
    )
}

export default App
