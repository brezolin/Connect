import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navegacao.css'

const Navigation = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/profile">Perfil</Link></li>
        <li><Link to="/friends">Amigos</Link>
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
