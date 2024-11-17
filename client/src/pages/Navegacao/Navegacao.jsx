import React from 'react';
import { Link } from 'react-router-dom';
import './Navegacao.css'; // Importa o arquivo CSS para estilos

const Navegacao = () => {
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
        </ul>
      </div>
    </nav>
  );
};

export default Navegacao;
