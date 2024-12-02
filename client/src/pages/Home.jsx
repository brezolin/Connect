import React from 'react';
import { useNavigate } from 'react-router-dom';
import Feed from '../components/Feed';
import './Home.css'

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');  // Navega para a página de login
  };

  return (
    <div >
      <h1 >Bem-vindo ao Sistema</h1>
      <p>Gerenciamento de Ordens de Serviço</p>
      <button onClick={handleLoginClick} >
        Ir para Login
      </button>



      <Feed />
    </div>
  );
};





export default Home;
