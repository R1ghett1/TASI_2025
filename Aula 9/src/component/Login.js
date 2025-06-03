import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {

    var [usuario, setUsuario] = useState('')  //Se aqui fosse login seria usuario:login da linha 13
    var [senha, setSenha] = useState('')

    const ValidaUsuario = async () => {

        var url = "https://backend-aula.vercel.app/app/login"
        var dados = {
            usuario: usuario,  // enviado via JSON, requisitando para um usario, e recebendo a variavel usuario da nossa aplicacao
            senha      //a mesma coisa de o de cima
        }

        await axios.post(url, dados).then(retorno => {
            console.log(retorno)
            if (retorno.data.erro) {
                alert(retorno.data.erro)
                return
            }

            if (retorno.data.token) {
                localStorage.setItem("ALUNO_ITE", retorno.data.token) 
            }
        })

        /* 
        if (usuario == "aluno" && senha == "123")
            localStorage.setItem("ALUNO_ITE", "OK") 
        else 
            alert("Senha invalida")
        */
    }

    return (
        <div>
            <h1>Faça seu Login</h1>
            <input type="text" placeholder="Usuário" onChange={(e) => setUsuario(e.target.value)}/>
            <input type="password" placeholder="Digite sua senha" onChange={(e) => setSenha(e.target.value)}/>
            <input type="button" value="Logar" onClick={() => ValidaUsuario()}/>
        </div>
    )
}

export default Login