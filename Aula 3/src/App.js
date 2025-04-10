import React, {useState} from 'react'
import Filho from './component/Filho'

//Function App() {} 

//Componente APP
const App = () => {

    var [valor, setValor] = useState()
    var [cor, setCor] = useState()

    return(
        <div style={
            {backgroundColor: "purple"}
            }>
            <input type="text" onChange={ (e) => setValor(e.target.value)}/>
            <input type="text" onChange={ (e) => setCor(e.target.value)}/>
            <Filho texto={valor} fundo={cor}/>
        </div>
    )
}

export default App
