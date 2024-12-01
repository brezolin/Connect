import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFriend from '../components/AddFriend';
import './FriendList.css';


const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  // Recupera o ID do usuário do localStorage
  const userId = localStorage.getItem('user');

  useEffect(() => {
    if (!userId) {
      setError('Erro ao carregar ID do usuário.');
      return;
    }

    axios
      .get(`http://localhost:3000/api/users/${userId}/friends`)
      .then((response) => {
        console.log('Resposta da API:', response.data);
        setFriends(response.data)
        console.log(response.data);
      })
      .catch(() => {
        setError('Erro ao carregar amigos.');
        setFriends([]); // Define como um array vazio se houver erro
      });
  }, [userId]);

  return (
     
      <div className="friends-list-container">
        <h2>Meus Amigos</h2>
        <AddFriend userId={userId} />
        {error && <p className="friends-list-error">{error}</p>}
        <ul className="friends-list">
          {Array.isArray(friends) && friends.map((friend) => (
            <li key={friend.id}>
              <span>{friend.name || friend.username || friend.email || 'Usuário sem nome'}</span>
            </li>
          ))}
        </ul>
      </div>
    );
    

  
};

export default FriendsList;
