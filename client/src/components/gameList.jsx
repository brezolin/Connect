import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/games'); // URL da sua API backend
        setGames(response.data); // Armazena os jogos na variável de estado
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar jogos.');
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <p>Carregando jogos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Lista de Jogos</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id} style={styles.card}>
            <img
              src={game.background_image}
              alt={game.name}
              style={styles.image}
            />
            <div style={styles.details}>
              <h2>{game.name}</h2>
              <p>Lançamento: {game.released}</p>
              <p>Avaliação: {game.rating}/5</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '150px',
    height: '100px',
    marginRight: '20px',
    borderRadius: '8px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export default GameList;
