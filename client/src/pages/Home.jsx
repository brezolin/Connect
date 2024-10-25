import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');  // Navega para a página de login
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bem-vindo ao Sistema</h1>
      <p style={styles.subtitle}>Gerenciamento de Ordens de Serviço</p>
      <button onClick={handleLoginClick} style={styles.button}>
        Ir para Login
      </button>
    </div>
  );
};

// Estilos inline para o componente
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;
