
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GameList = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/games`); // Dynamic URL from environment variables
        setGames(response.data);
      } catch (error) {
        const message = error.response?.data?.error || 'Erro ao carregar os jogos.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <p>Carregando jogos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="game-list">
      <h2>Lista de Jogos</h2>
      {games.length > 0 ? (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum jogo encontrado.</p>
      )}
    </div>
  );
};

export default GameList;
