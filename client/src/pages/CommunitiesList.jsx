import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CommunitiesList.css';

const CommunitiesList = () => {
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/communities', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCommunities(response.data);
      } catch (error) {
        console.error('Erro ao buscar comunidades:', error);
        if (error.response && error.response.status === 401) {
          setError('Você não está autenticado. Faça login novamente.');
        } else {
          setError('Erro ao carregar as comunidades. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (isLoading) {
    return <div className="loading">Carregando comunidades...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="communities-list">
      <h1>Comunidades</h1>
      <button className="create-community-btn" onClick={() => navigate('/create-community')}>
        Criar Nova Comunidade
      </button>
      {communities.length === 0 ? (
        <p>Nenhuma comunidade encontrada.</p>
      ) : (
        <ul>
          {communities.map((community) => (
            <li key={community.id} className="community-card">
              <h2>{community.name}</h2>
              <p>{community.description}</p>
              <p>
                <strong>Tipo:</strong> {community.type === 'open' ? 'Aberta' : 'Fechada'}
              </p>
              <button onClick={() => navigate(`/community/${community.id}`)}>
                Ver Comunidade
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommunitiesList;
