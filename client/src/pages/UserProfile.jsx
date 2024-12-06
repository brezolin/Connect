import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css'; // Importando o arquivo de estilos
import ProfilePictureUpload from '../components/uploudPictureProfile';
import AddFriend from '../components/AddFriend';

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
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar informações do perfil.');
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId, token]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (err) {
        console.error('Erro ao buscar amigos:', err.message);
      }
    };
    fetchFriends();
  }, [userId, token]);

  useEffect(() => {
    const fetchAvailablePlatforms = async () => {
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:3000/api/platforms', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailablePlatforms(response.data);
      } catch (err) {
        console.error('Erro ao buscar plataformas disponíveis:', err.message);
      }
    };
    fetchAvailablePlatforms();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    if (!token) return;
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/games/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: searchTerm },
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error('Erro ao buscar jogos:', err.message);
      }
    };
    const timeoutId = setTimeout(fetchGames, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  const handleRemoveFriend = async (friendId) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}/removeFriend`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { friendId },
      });
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    } catch (err) {
      console.error('Erro ao remover amigo:', err.message);
    }
  };

  const handleRemovePlatform = async (platformName) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}/platforms`, {
        headers: { Authorization: `Bearer ${token}` },
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
    if (!token) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}/games`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleAddPlatform = async (platformName) => {
    if (!platformName || !token) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/${userId}/platforms`,
        { platform: platformName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setUser((prev) => ({
          ...prev,
          platforms: [
            ...(prev.platforms || []),
            availablePlatforms.find((p) => p.name === platformName),
          ],
        }));
      } else {
        console.error('Erro ao adicionar plataforma: Resposta inesperada do servidor.');
      }
    } catch (err) {
      console.error('Erro ao adicionar plataforma:', err.message);
    }
  };

  const handleAddGame = async (game) => {
    if (!token) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/${userId}/games`,
        { game: game.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
      <div className="profile-wrapper">
        <div className="profile-header">
          <div className="profile-info">
            <img
              src={`http://localhost:3000/${user.profilePicture}`}
              alt="Foto de perfil"
              className="profile-picture"
            />
            <h1 className="profile-title">Bem-vindo, {user.username}!</h1>
          </div>
          <ProfilePictureUpload />
        </div>

        {/* Amigos */}
        <div className="profile-section">
          <h3>Amigos</h3>
          <div className="friends-grid">
            {friends.map((friend, index) => (
              <div key={`${friend.name}-${index}`} className="friend-card">
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFriend(friend.id)}
                >
                  &times;
                </button>
                <img
                  src={`http://localhost:3000/${friend.profilePicture}` || '/images/default_user.png'}
                  alt={friend.name || 'Amigo'}
                  className="friend-image"
                />
                <p>{friend.name || friend.username}</p>
              </div>
            ))}
            <div
              className="friend-card add-card"
              onClick={() => setShowAddFriend(true)}
            >
              <div className="add-icon">+</div>
              <p>Adicionar Amigo</p>
            </div>
          </div>
        </div>

        {/* Modal de adicionar amigo */}
        {showAddFriend && (
          <Modal
            isOpen={showAddFriend}
            title="Busque um amigo"
            onClose={() => setShowAddFriend(false)}
          >
            <AddFriend userId={userId} onClose={() => setShowAddFriend(false)} />
          </Modal>
        )}

        {/* Plataformas */}
        <div className="profile-section">
          <h3>Plataformas</h3>
          <div className="platforms-grid">
            {platforms.map((platform, index) => (
              <div key={`${platform.name}-${index}`} className="platform-card">
                <button
                  className="remove-button"
                  onClick={() => handleRemovePlatform(platform.name)}
                >
                  &times;
                </button>
                <img
                  src={platform.image_url ? `http://localhost:3000${platform.image_url}` : '/images/default_platform.png'}
                  alt={platform.name || 'Plataforma'}
                  className="platform-image"
                />
                <p>{platform.name}</p>
              </div>
            ))}
            <div
              className="platform-card add-card"
              onClick={() => setShowAddPlatform(true)}
            >
              <div className="add-icon">+</div>
              <p>Adicionar Plataforma</p>
            </div>
          </div>
        </div>

        {/* Jogos Favoritos */}
        <div className="profile-section">
          <h3>Jogos Favoritos</h3>
          <div className="games-grid">
            {favoriteGames.map((game, index) => (
              <div key={`${game.name}-${index}`} className="game-card">
                <button
                  className="remove-button"
                  onClick={() => handleRemoveGame(game.name)}
                >
                  &times;
                </button>
                <img
                  src={game.image || '/images/default_game.png'}
                  alt={game.name}
                  className="game-image"
                />
                <p>{game.name}</p>
              </div>
            ))}
            <div
              className="game-card add-card"
              onClick={() => setShowAddGame(true)}
            >
              <div className="add-icon">+</div>
              <p>Adicionar Jogo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de adicionar plataforma */}
      {showAddPlatform && (
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
                  handleAddPlatform(platform.name);
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
      )}

      {/* Modal de adicionar jogo */}
      {showAddGame && (
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
            className="modal-search-input"
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
                <img
                  src={game.image || '/images/default_game.png'}
                  alt={game.name}
                  className="game-image"
                />
                <p>{game.name}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
