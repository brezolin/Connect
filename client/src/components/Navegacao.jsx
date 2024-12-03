import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Navegacao.css';

const socket = io('http://localhost:3000');

const Navigation = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]); // Lista de notificações
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Controle de dropdown
  const userId = Number(localStorage.getItem('user'));

  // Buscar notificações iniciais
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/notifications/${userId}`
        );
        setNotifications(response.data || []);
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
        setNotifications((prev) => [
          ...prev,
          { id: message.id, content: message.content, senderName: message.senderName },
        ]);
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

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    // Marcar notificações como lidas (opcional)
    if (notifications.length > 0) {
      setNotifications([]);
    }
  };

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/friends">Amigos</Link></li>
        <li><Link to="/chat">Mensagens</Link></li>
        <li className="notifications-container">
          <button className="notifications-icon" onClick={toggleNotifications}>
            <i className="fas fa-bell"></i> {/* Ícone de sino */}
            {notifications.length > 0 && (
              <span className="notification-badg">{notifications.length}</span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.senderName}: {notification.content}</p>
                  </div>
                ))
              ) : (
                <p className="no-notifications">Sem novas notificações.</p>
              )}
            </div>
          )}
        </li>
        {isAuthenticated ? (
          <li><button className="logout-button" onClick={handleLogout}>Sair</button></li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
