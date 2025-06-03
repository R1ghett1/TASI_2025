import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Style.css'; // Certifique-se de que este CSS existe e contém estilos relevantes

const LimparDados = () => {
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("ALUNO_ITE");
    const usuario = localStorage.getItem("USUARIO_LOGADO");
    const navigate = useNavigate();

    const handleLimparDados = async () => {
        // Validação de autenticação
        if (!usuario || !token) {
            alert("Usuário não autenticado. Por favor, faça login novamente.");
            navigate("/login"); // Redireciona para a tela de login
            return;
        }

        // Confirmação com o usuário antes de executar a ação de limpeza
        const confirmacao = window.confirm(
            "Tem certeza que deseja LIMPAR TODOS OS DADOS relacionados ao seu usuário? Esta ação é irreversível!"
        );

        if (!confirmacao) {
            return; // Usuário cancelou a operação
        }

        setLoading(true); // Ativa o estado de carregamento
        try {
            const response = await axios.get(
                `https://backend-completo.vercel.app/app/limpar`,
                {
                    headers: {
                        "Authorization": "Bearer " + token,
                        // Assumindo que o endpoint de limpar precisa do ID do usuário,
                        // mas como não é explicitamente passado na URL /app/limpar,
                        // é provável que o backend obtenha o usuário do token.
                        // Se o backend espera o usuário na URL, ajuste para:
                        // `https://backend-completo.vercel.app/app/limpar/${usuario}`
                    },
                    // Caso o backend espere o usuário no corpo para DELETE/POST, mas é um GET aqui.
                    // params: { usuario: usuario } // Descomente se o backend espera o 'usuario' como query param
                }
            );

            // Verifica a resposta da API (ajuste conforme o retorno real da sua API)
            if (response.status === 200) {
                alert("Dados limpos com sucesso!");
                // Opcional: Redirecionar o usuário ou recarregar a página
                // navigate("/"); // Exemplo: Redirecionar para a página inicial
                // window.location.reload(); // Exemplo: Recarregar a página para refletir a limpeza
            } else {
                alert(`Erro ao limpar dados: ${response.status} - ${response.data?.message || 'Resposta inesperada'}`);
            }
        } catch (error) {
            console.error("Erro ao tentar limpar dados:", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    alert(`Erro do servidor: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`);
                } else if (error.request) {
                    alert("Erro: Nenhuma resposta do servidor. Verifique a URL da API ou sua conexão.");
                } else {
                    alert(`Erro inesperado: ${error.message}`);
                }
            } else {
                alert(`Erro desconhecido: ${error.message}`);
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="limpar-dados__container">
            <h1 className="limpar-dados__titulo">Limpeza de Dados do Usuário</h1>
            <p className="limpar-dados__aviso">
                Esta função permite limpar todos os dados associados ao seu usuário no sistema.
                <br />
                **ATENÇÃO: Esta é uma ação irreversível e irá apagar todos os seus produtos, categorias, etc.**
            </p>
            <button
                className="limpar-dados__botao"
                onClick={handleLimparDados}
                disabled={loading} // Desabilita o botão durante o carregamento
            >
                {loading ? "Limpando..." : "Limpar Meus Dados Agora"}
            </button>
        </div>
    );
};

export default LimparDados;