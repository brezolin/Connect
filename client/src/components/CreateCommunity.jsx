import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateCommunity.css';

const CreateCommunity = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('open');
  const [associatedGame, setAssociatedGame] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token'); // Recupera o token armazenado
    if (!token) {
      alert('Você precisa estar autenticado para criar uma comunidade.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/communities/create',
        {
          name,
          type,
          description,
          associatedGame,
          creatorId: localStorage.getItem('user'),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          },
        }
      );
      alert('Comunidade criada com sucesso!');
      navigate('/communities');
    } catch (error) {
      console.error('Erro ao criar comunidade:', error);
      alert('Erro ao criar comunidade. Tente novamente mais tarde.');
    }
  };
  

  return (
    <div className="create-community">
      <h1>Criar Nova Comunidade</h1>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Tipo:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="open">Aberta</option>
          <option value="closed">Fechada</option>
        </select>
        <label>Jogo Associado (opcional):</label>
        <input
          type="text"
          value={associatedGame}
          onChange={(e) => setAssociatedGame(e.target.value)}
        />
        <button type="submit">Criar Comunidade</button>
      </form>
    </div>
  );
};

export default CreateCommunity;
