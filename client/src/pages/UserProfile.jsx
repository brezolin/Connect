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
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [showAddGame, setShowAddGame] = useState(false);
  const userId = localStorage.getItem('user');

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
      const response = await axios.post(`http://localhost:3000/api/users/${userId}/platforms`, {
        platform: selectedPlatform,
      });

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          platforms: [...(prev.platforms || []), availablePlatforms.find((p) => p.name === selectedPlatform)],
        }));
        setSelectedPlatform('');
        setShowAddPlatform(false);
      } else {
        console.error('Erro ao adicionar plataforma: Resposta inesperada do servidor.');
      }
    } catch (err) {
      console.error('Erro ao adicionar plataforma:', err.message);
    }
  };

  const handleAddGame = async (game) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/users/${userId}/games`, {
        game: game.name,
      });

      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          favorite_games: [...(prev.favorite_games || []), game],
        }));
        setSearchTerm('');
        setSearchResults([]);
        setShowAddGame(false);
      } else {
        console.error('Erro ao adicionar jogo: Resposta inesperada do servidor.');
      }
    } catch (err) {
      console.error('Erro ao adicionar jogo favorito:', err.message);
    }
  };

  if (loading) return <p>Carregando perfil...</p>;
  if (error) return <p>{error}</p>;

  const platforms = user.platforms || [];
  const favoriteGames = user.favorite_games || [];

  const Modal = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };
  

  return (
    <div className="profile-container">
      <h1 className="profile-title">Bem-vindo, {user.name}!</h1>
      <div className="profile-card">
        <div className="profile-section">
          <h3>Plataformas</h3>
          <div className="platforms-grid">
            {platforms.map((platform, index) => (
              <div key={`${platform.name}-${index}`} className="platform-card">
                <img
                  src={platform.image_url ? `http://localhost:3000${platform.image_url}` : '/images/default_platform.png'}
                  alt={platform.name || 'Plataforma'}
                  className="platform-image"
                />
                <div className="platform-details">
                  <p>{platform.name}</p>
                </div>
              </div>
            ))}
            <div className="platform-card add-card" onClick={() => setShowAddPlatform(true)}>
              <div className="add-icon">+</div>
              <p>Adicionar Plataforma</p>
            </div>
          </div>
        </div>
  
        <div className="profile-section">
          <h3>Jogos Favoritos</h3>
          <div className="games-grid">
            {favoriteGames.map((game, index) => (
              <div key={`${game.name}-${index}`} className="game-card">
                <img src={game.image || '/images/default_game.png'} alt={game.name} className="game-image" />
                <div className="game-details">
                  <p>{game.name}</p>
                </div>
              </div>
            ))}
            <div className="game-card add-card" onClick={() => setShowAddGame(true)}>
              <div className="add-icon">+</div>
              <p>Adicionar Jogo</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Modal para Adicionar Plataforma */}
      <Modal
        isOpen={showAddPlatform}
        title="Selecione uma Plataforma"
        onClose={() => setShowAddPlatform(false)}
      >
        <div className="platforms-grid">
          {availablePlatforms.map((platform) => (
            <div
              key={platform.id}
              className="platform-card"
              onClick={() => {
                setSelectedPlatform(platform.name);
                handleAddPlatform();
                setShowAddPlatform(false);
              }}
            >
              <img
                src={platform.image_url ? `http://localhost:3000${platform.image_url}` : '/images/default_platform.png'}
                alt={platform.name}
                className="platform-image"
              />
              <p>{platform.name}</p>
            </div>
          ))}
        </div>
      </Modal>
  
      {/* Modal para Adicionar Jogos */}
      <Modal
        isOpen={showAddGame}
        title="Busque um Jogo"
        onClose={() => setShowAddGame(false)}
      >
        <input
          type="text"
          placeholder="Buscar jogos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <div className="games-grid">
          {searchResults.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => {
                handleAddGame(game);
                setShowAddGame(false);
              }}
            >
              <img src={game.image || '/images/default_game.png'} alt={game.name} className="game-image" />
              <p>{game.name}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};  

export default Profile;
