import React from 'react'
import axios from 'axios'

const Produtos = () => {

    const BuscarProdutos = async () => {
        //Axios.get, post, put, delete, patch
        console.log('teste')
        var token = localStorage.getItem("ALUNO_ITE")

        var url ="https://backend-aula.vercel.app/app/produtos"
        await axios.get(url, {headers: {"Authorization": "Bearer" + token}}).then(retorno => {console.log(retorno)})
    }

    return (
        <div>
            <h1>Produtos</h1>
            <input type="button" value="Buscar" onClick={ () => BuscarProdutos()}/>
        </div>
    )
}

export default Produtos