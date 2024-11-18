import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navegacao.css'; // Importa o arquivo CSS para estilos

const Navegacao = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remover token do localStorage (ou qualquer armazenamento usado)
    localStorage.removeItem('token');
    // Redirecionar para a página de login
    navigate('/login');
  };

  return (
    <nav className="navegacao">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          GameConnect
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/profile">Perfil</Link>
          </li>
          <li>
            <Link to="/comunits">Comunidades</Link>
          </li>
          <li>
            <Link to="/friends">Amigos</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="nav-logout-button">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navegacao;