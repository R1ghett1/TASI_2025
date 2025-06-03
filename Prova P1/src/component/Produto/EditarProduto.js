import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import '../../Style.css';

const EditarProduto = () => {
    const [produto, setProduto] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const token = localStorage.getItem("ALUNO_ITE");
    const usuario = localStorage.getItem("USUARIO_LOGADO");
    const { id } = useParams(); // Pega o ID do produto da URL
    const navigate = useNavigate();

    useEffect(() => {
        const carregarDadosEdicao = async () => {
            if (!usuario || !token) {
                alert("Usuário não autenticado. Por favor, faça login novamente.");
                navigate("/login"); // Redireciona para a tela de login se não houver autenticação
                return;
            }

            try {
                // URLs da API para produtos e categorias
                const urlProdutos = `https://backend-completo.vercel.app/app/produtos/${usuario}/`;
                const urlCategorias = "https://backend-completo.vercel.app/app/categorias";

                // Busca simultânea de produtos e categorias
                const [produtosRes, categoriasRes] = await Promise.all([
                    axios.get(urlProdutos, { headers: { Authorization: "Bearer " + token } }),
                    axios.get(urlCategorias, { headers: { Authorization: "Bearer " + token } }),
                ]);

                // Encontra o produto específico pelo ID retornado na URL
                const produtoRecebido = produtosRes.data.find(p => p._id === id);

                if (!produtoRecebido) {
                    alert("Produto não encontrado.");
                    navigate("/listarproduto"); // Volta para a lista se o produto não for encontrado
                    return;
                }

                const todasCategorias = categoriasRes.data;
                let categoriaIdParaPrePopular = '';

                // Lógica para normalizar a categoria: garantir que 'produto.categoria' seja um ID
                // Verifica se a 'categoria' do produto recebido já é um ID válido (geralmente uma string longa e alfanumérica)
                if (typeof produtoRecebido.categoria === 'string' && produtoRecebido.categoria.length > 20 && /[0-9a-fA-F]/.test(produtoRecebido.categoria)) {
                    const categoriaEncontradaPorId = todasCategorias.find(cat => String(cat._id) === String(produtoRecebido.categoria));
                    if (categoriaEncontradaPorId) {
                        categoriaIdParaPrePopular = categoriaEncontradaPorId._id;
                    }
                } else {
                    // Se não for um ID, assume que é o nome da categoria e tenta encontrar o ID correspondente
                    const categoriaEncontradaPorNome = todasCategorias.find(cat => cat.nome === produtoRecebido.categoria);
                    if (categoriaEncontradaPorNome) {
                        categoriaIdParaPrePopular = categoriaEncontradaPorNome._id;
                    }
                }

                // Define o estado do produto com a categoria normalizada para o ID
                setProduto({
                    ...produtoRecebido,
                    categoria: categoriaIdParaPrePopular
                });
                setCategorias(todasCategorias); // Define as categorias disponíveis para o select

            } catch (erro) {
                console.error("❌ Erro ao carregar produto ou categorias:", erro);
                alert("Erro ao carregar dados do produto para edição.");
            }
        };

        carregarDadosEdicao();
    }, [id, token, usuario, navigate]); // Adiciona 'navigate' às dependências do useEffect

    // Manipulador de mudança para todos os campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Função para lidar com a submissão do formulário de edição
    const editarProduto = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página

        // Validação básica antes de enviar
        if (!produto.nome || !produto.quantidade || !produto.preco || !produto.categoria || !produto.descricao || !produto.imagem) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            // Envia os dados atualizados para a API
            await axios.put(
                `https://backend-completo.vercel.app/app/produtos`,
                {
                    id: produto._id,
                    nome: produto.nome,
                    quantidade: Number(produto.quantidade), // Garante que é um número
                    preco: Number(produto.preco),           // Garante que é um número
                    categoria: produto.categoria,          // Já é o ID da categoria
                    descricao: produto.descricao,
                    imagem: produto.imagem,
                },
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );

            alert("Produto atualizado com sucesso!");
            navigate("/listarproduto"); // Redireciona para a lista de produtos após a atualização
        } catch (erro) {
            console.error("❌ Erro ao atualizar produto:", erro);
            // Mensagens de erro mais específicas do backend podem ser acessadas via erro.response.data
            alert("Erro ao atualizar produto. Verifique o console para mais detalhes.");
        }
    };

    // Exibe mensagem de carregamento enquanto o produto não é carregado
    if (!produto) {
        return <p>Carregando produto para edição...</p>;
    }

    // Renderiza o formulário de edição
    return (
        <div className="editar-produto__container">
            <h1 className="editar-produto__titulo">Editar Produto</h1>
            <form onSubmit={editarProduto}>
                <label className="editar-produto__label">
                    Nome:
                    <input
                        type="text"
                        name="nome"
                        value={produto.nome || ''} // Adiciona fallback para ''
                        onChange={handleChange}
                        className="editar-produto__input"
                        required // Campo obrigatório
                    />
                </label>

                <label className="editar-produto__label">
                    Quantidade:
                    <input
                        type="number"
                        name="quantidade"
                        value={produto.quantidade || ''}
                        onChange={handleChange}
                        className="editar-produto__input"
                        required
                    />
                </label>

                <label className="editar-produto__label">
                    Preço:
                    <input
                        type="number"
                        name="preco"
                        step="0.01" // Permite valores decimais
                        value={produto.preco || ''}
                        onChange={handleChange}
                        className="editar-produto__input"
                        required
                    />
                </label>

                <label className="editar-produto__label">
                    Categoria:
                    <select
                        name="categoria"
                        value={produto.categoria || ''} // O valor deve ser o ID da categoria
                        onChange={handleChange}
                        className="editar-produto__select"
                        required
                    >
                        <option value="">Selecione uma categoria</option> {/* Opção padrão */}
                        {categorias.map((cat) => (
                            <option key={cat.nome} value={cat.nome}>
                                {cat.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="editar-produto__label">
                    Descrição:
                    <textarea
                        name="descricao"
                        value={produto.descricao || ''}
                        onChange={handleChange}
                        className="editar-produto__textarea"
                        required
                    />
                </label>

                <label className="editar-produto__label">
                    Imagem (URL ou nome do arquivo):
                    <input
                        type="text"
                        name="imagem"
                        value={produto.imagem || ''}
                        onChange={handleChange}
                        className="editar-produto__input"
                        required
                    />
                </label>

                <button type="submit" className="editar-produto__botao">Atualizar Produto</button>
            </form>
        </div>
    );
};

export default EditarProduto;