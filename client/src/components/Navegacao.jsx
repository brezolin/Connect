import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Navegacao.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Navigation = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(0);
  const userId = Number(localStorage.getItem('user'));

  useEffect(() => {
    // Buscar notificações iniciais
    async function fetchNotifications() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/notifications/${userId}`
        );
        setNotifications(response.data.total || 0); // Total de notificações não lidas
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    }
    if (userId) {
      fetchNotifications();
    }

    // Atualizar notificações em tempo real
    socket.on('receive_message', (message) => {
      if (message.receiverId === userId) {
        setNotifications((prev) => prev + 1); // Incrementar contador
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/friends">Amigos</Link></li>
        <li>
          <Link to="/chat">
            Mensagens
            {notifications > 0 && (
              <span className="notification-icon">{notifications}</span>
            )}
          </Link>
        </li>
        {isAuthenticated ? (
          <li><button onClick={handleLogout}>Sair</button></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
