import React, { useState } from 'react';
import axios from 'axios';
import Blog from './Blog';

const EnderecoForm = () => {
  const [cep, setCep] = useState('');
  const [cepValido, setCepValido] = useState(false); 
  const [enderecoData, setEnderecoData] = useState({
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const handleCepChange = (e) => {
    setCep(e.target.value);
    setCepValido(false); 
  };

  const handleBlurCep = async () => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data.erro) {
          alert("CEP não encontrado.");
          return;
        }
        
        const { logradouro, bairro, localidade, uf } = response.data;
        setEnderecoData({
          endereco: logradouro,
          bairro: bairro,
          cidade: localidade,
          estado: uf,
        });
        setCepValido(true);
      } catch (error) {
        console.error("Erro ao buscar o CEP", error);
        alert("Erro ao buscar o CEP.");
      }
    } else {
      alert("Digite um CEP válido.");
    }
  };

  return (
    <div id='conteudo' className="container">
        <div id='h2'>
            <h2>Digite seu CEP para consultar</h2>
        </div>
      <form>
        <div id='campo'>
          <label>CEP:</label>
          <input
            type="text"
            value={cep}
            onChange={handleCepChange}
            onBlur={handleBlurCep}
            maxLength="8"
            placeholder="Digite o CEP"
          />
        </div>
        {['endereco', 'bairro', 'cidade', 'estado'].map((field) => (
          <div key={field} id='campo'>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
            <input
              type="text"
              value={enderecoData[field]}
              disabled
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          </div>
        ))}
      </form>

      {/* Exibe o Blog somente se um CEP válido foi encontrado */}
      {cepValido && <Blog enderecoData={enderecoData} />}
    </div>
  );
};

export default EnderecoForm;
