import React, { useState } from "react";
import axios from "axios";

const Registrar = () => {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [confirma, setConfirma] = useState("");

    const criaUsuario = async () => {
        const url = "https://backend-aula.vercel.app/app/registrar";
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
            }
        } catch (erro) {
            console.error("Erro ao registrar usuário", erro);
            alert("Erro ao registrar usuário");
        }
    };

    return (
        <div>
            <h2>Registrar Usuário</h2>
            <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirmar Senha"
                value={confirma}
                onChange={(e) => setConfirma(e.target.value)}
            />
            <button onClick={criaUsuario}>Registrar</button>
        </div>
    );
};

export default Registrar;
