import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link também
import axios from "axios";

const Registrar = () => {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [confirma, setConfirma] = useState("");
    const navigate = useNavigate();

    const criaUsuario = async () => {
        const url = "https://backend-completo.vercel.app/app/registrar";
        const dados = {
            usuario,
            senha,
            confirma
        };

        try {
            const retorno = await axios.post(url, dados);
            console.log(retorno);
            if (retorno.data.error) {
                alert(retorno.data.error);
            } else {
                alert("Usuário registrado com sucesso!");
                navigate("/login"); // Redireciona para o login após o registro
            }
        } catch (erro) {
            console.error("Erro ao registrar usuário", erro);
            alert("Erro ao registrar usuário");
        }
    };

    return (
        // Adicionada uma classe única para o container do formulário de registro
        <div className="register-container">
            <h2 className="register-title">Registrar Usuário</h2>
            <input
                className="register-input" // Adicionada classe para os inputs
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                className="register-input" // Adicionada classe para os inputs
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <input
                className="register-input" // Adicionada classe para os inputs
                type="password"
                placeholder="Confirmar Senha"
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
            />
            <button
                className="register-button" // Adicionada classe para o botão
                type="button" // Type "button" para evitar submit automático do formulário
                onClick={criaUsuario}
            >
                Registrar
            </button>
            {/* Opcional: Adicionar um link para o login aqui */}
            <p className="register-login-link">
                Já tem uma conta? <Link to="/login">Faça Login</Link>
            </p>
        </div>
    );
};

export default Registrar;