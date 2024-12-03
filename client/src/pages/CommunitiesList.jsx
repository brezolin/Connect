import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CommunitiesList.css';

const CommunitiesList = () => {
  const [communities, setCommunities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/communities');
        setCommunities(response.data);
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error);
      }
    };
    fetchCommunities();
  }, []);

  return (
    <div className="communities-list">
      <h1>Comunidades</h1>
      <button onClick={() => navigate('/create-community')}>Criar Nova Comunidade</button>
      <ul>
        {communities.map((community) => (
          <li key={community.id} className="community-card">
            <h2>{community.name}</h2>
            <p>{community.description}</p>
            <p><strong>Tipo:</strong> {community.type === 'open' ? 'Aberta' : 'Fechada'}</p>
            <button onClick={() => navigate(`/community/${community.id}`)}>Ver Comunidade</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunitiesList;
