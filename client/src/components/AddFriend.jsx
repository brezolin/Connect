import React, { useState } from 'react';
import axios from 'axios';
import './AddFriend.css';

const AddFriend = ({ userId, onClose, onFriendAdded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [addedFriends, setAddedFriends] = useState([]); // Armazena IDs dos amigos adicionados

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/api/users/search?query=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults(response.data.users || []);
      setError('');
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError('Erro ao buscar usuários.');
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/users/${userId}/friends`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Amigo adicionado com sucesso!');
        setAddedFriends((prev) => [...prev, friendId]);
        setSearchResults((prev) => prev.filter((user) => user.id !== friendId));

        // Notifica o componente pai
        if (onFriendAdded) {
          onFriendAdded(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar amigo:', error);
      setError('Erro ao adicionar amigo.');
    }
  };

  return (
    <div className="add-friend-container">
      {onClose && (
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      )}

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por username..."
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {error && <p className="add-friend-error">{error}</p>}
      {searchResults.length > 0 ? (
        <ul className="search-results">
          {searchResults.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> - {user.email}
              <button
                onClick={() => handleAddFriend(user.id)}
                disabled={addedFriends.includes(user.id)}
              >
                {addedFriends.includes(user.id) ? 'Adicionado' : 'Adicionar'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && !error && (
          <p className="no-results-message">Nenhum usuário encontrado.</p>
        )
      )}
    </div>
  );
};

export default AddFriend;
