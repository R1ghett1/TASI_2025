import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const ValidaUsuario = async () => {
        const url = "https://backend-completo.vercel.app/app/login";
        const dados = { usuario, senha };

        try {
            const retorno = await axios.post(url, dados);

            if (retorno.data.erro) {
                alert(retorno.data.erro);
                return;
            }

            if (retorno.data.token) {
                localStorage.setItem("ALUNO_ITE", retorno.data.token);
                localStorage.setItem("USUARIO_LOGADO", usuario);
                navigate("/app");
            }
        } catch (erro) {
            console.error("Erro ao fazer login:", erro);
            alert("Erro ao fazer login.");
        }
    };

    return (
        // Adicionada uma classe única para o container do formulário de login
        <div className="login-container">
            <h1 className="login-title">Faça seu Login</h1>
            <input
                className="login-input" // Adicionada classe para os inputs
                type="text"
                placeholder="Usuário"
                onChange={(e) => setUsuario(e.target.value)}
                value={usuario} // Adicionado value para controle do input
            />
            <input
                className="login-input" // Adicionada classe para os inputs
                type="password"
                placeholder="Digite sua senha"
                onChange={(e) => setSenha(e.target.value)}
                value={senha} // Adicionado value para controle do input
            />
            <button
                className="login-button" // Adicionada classe para o botão
                type="button" // Type "button" para evitar submit automático do formulário
                onClick={ValidaUsuario}
            >
                Logar
            </button>
            {/* Opcional: Adicionar um link para o registro aqui também, se for o caso */}
            <p className="login-register-link">
                Não tem uma conta? <Link to="/registrar">Registre-se aqui</Link>
            </p>
        </div>
    );
};

export default Login;