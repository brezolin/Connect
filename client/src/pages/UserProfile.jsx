import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Importando o arquivo de estilos

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const userId = 1;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar informações do perfil.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    const fetchAvailablePlatforms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/platforms');
        setAvailablePlatforms(response.data);
      } catch (err) {
        console.error('Erro ao buscar plataformas disponíveis:', err.message);
      }
    };

    fetchAvailablePlatforms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/games/search', {
          params: { query: searchTerm },
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err.message);
      }
    };

    const timeoutId = setTimeout(fetchGames, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddPlatform = async () => {
    if (!selectedPlatform) return;

    try {
      await axios.post(`http://localhost:3000/api/users/${userId}/platforms`, { platform: selectedPlatform });
      setUser((prev) => ({
        ...prev,
        platforms: [...(prev.platforms || []), availablePlatforms.find((p) => p.name === selectedPlatform)],
      }));
      setSelectedPlatform('');
    } catch (err) {
      console.error('Erro ao adicionar plataforma:', err.message);
    }
  };

  const handleAddGame = async (game) => {
    try {
      await axios.post(`http://localhost:3000/api/users/${userId}/games`, { game: game.name });
      setUser((prev) => ({
        ...prev,
        favorite_games: [...(prev.favorite_games || []), game],
      }));
      setSearchTerm('');
      setSearchResults([]);
    } catch (err) {
      console.error('Erro ao adicionar jogo favorito:', err.message);
    }
  };

  const handleRemovePlatform = async (platformName) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}/platforms`, {
        data: { platform: platformName },
      });
      setUser((prev) => ({
        ...prev,
        platforms: prev.platforms.filter((platform) => platform.name !== platformName),
      }));
    } catch (err) {
      console.error('Erro ao remover plataforma:', err.message);
    }
  };

  const handleRemoveGame = async (gameName) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}/games`, {
        data: { game: gameName },
      });
      setUser((prev) => ({
        ...prev,
        favorite_games: prev.favorite_games.filter((game) => game.name !== gameName),
      }));
    } catch (err) {
      console.error('Erro ao remover jogo favorito:', err.message);
    }
  };

  if (loading) return <p>Carregando perfil...</p>;
  if (error) return <p>{error}</p>;

  const platforms = user.platforms || [];
  const favoriteGames = user.favorite_games || [];

  return (
    <div className="profile-container">
      <h1>Perfil do Usuário</h1>
      <div className="profile-card">
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>

        <div>
          <h3>Plataformas</h3>
          {platforms.length === 0 ? (
            <p>Nenhuma plataforma associada ainda.</p>
          ) : (
            <div className="platforms-grid">
              {platforms.map((platform, index) => (
                <div key={`${platform.name}-${index}`} className="platform-card">
                  <img
                    src={platform.image_url ? `http://localhost:3000${platform.image_url}` : '/images/default_platform.png'}
                    alt={platform.name || 'Plataforma'}
                    className="platform-image"
                  />
                  <p>{platform.name || 'Desconhecida'}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemovePlatform(platform.name)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Jogos Favoritos</h3>
          {favoriteGames.length === 0 ? (
            <p>Você ainda não adicionou jogos favoritos.</p>
          ) : (
            <div className="games-grid">
              {favoriteGames.map((game, index) => (
                <div key={`${game.name}-${index}`} className="game-card">
                  {game.image ? (
                    <img src={game.image} alt={game.name} className="game-image" />
                  ) : (
                    <p>Imagem não disponível</p>
                  )}
                  <p>{game.name}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveGame(game.name)}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="add-icon-container" onClick={() => setShowAddOptions(!showAddOptions)}>
        <span className="add-icon">+</span>
      </div>

      {showAddOptions && (
        <div className="add-form">
          <h3>Adicionar Plataforma</h3>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="input"
          >
            <option value="">Selecione uma Plataforma</option>
            {availablePlatforms.map((platform) => (
              <option key={platform.id} value={platform.name}>
                {platform.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddPlatform} className="add-button">Adicionar Plataforma</button>

          <h3>Buscar Jogos</h3>
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((game) => (
                <li
                  key={game.id}
                  className="search-result-item"
                  onClick={() => handleAddGame(game)}
                >
                  <img src={game.image} alt={game.name} className="search-result-image" />
                  <span>{game.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
