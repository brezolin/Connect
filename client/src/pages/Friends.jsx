import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddFriend from '../components/AddFriend';
import './FriendList.css';
import { FaEnvelope } from 'react-icons/fa'; // Importar ícone do Font Awesome

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('user');
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    if (!userId) {
      setError('Erro ao carregar ID do usuário.');
      return;
    }

    axios
      .get(`http://localhost:3000/api/users/${userId}/friends`)
      .then((response) => {
        setFriends(response.data);
      })
      .catch(() => {
        setError('Erro ao carregar amigos.');
        setFriends([]);
      });
  }, [userId]);

  const handleSendMessage = (friendId) => {
    console.log(`Iniciar chat com o amigo de ID: ${friendId}`);
    // Navegar para a rota de chat com o ID do amigo
    navigate(`/chat/${friendId}`);
  };

  return (
    <div className="friends-list-container">
      <h2>Meus Amigos</h2>
      <AddFriend userId={userId} />
      {error && <p className="friends-list-error">{error}</p>}
      <ul className="friends-list">
        {Array.isArray(friends) &&
          friends.map((friend) => (
            <li key={friend.id}>
              <span>{friend.name || friend.username || friend.email || 'Usuário sem nome'}</span>
              <FaEnvelope
                className="message-icon"
                onClick={() => handleSendMessage(friend.id)}
                style={{ marginLeft: '10px', cursor: 'pointer', color: '#007bff' }}
                title="Enviar mensagem"
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FriendsList;
