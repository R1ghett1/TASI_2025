import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blog = ({ enderecoData }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(data.slice(0, 10)); // Exibir apenas os 10 primeiros posts para melhor visualização
      } catch (error) {
        console.error("Erro ao buscar posts", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog</h1>
      {enderecoData?.endereco && (
        <p id='meio'>
          {enderecoData.endereco}, {enderecoData.bairro}, {enderecoData.cidade}, {enderecoData.estado}
        </p>
      )}
      {posts.length === 0 ? (
        <p>Carregando posts...</p>
      ) : (
        posts.map(({ id, title, body }) => (
          <div key={id} className="post">
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;
