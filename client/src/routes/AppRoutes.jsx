import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import UserProfile from '../pages/UserProfile';
import Navegacao from '../pages/Navegacao/Navegacao'; // Importando o componente de navegação

const AppRoutes = () => {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {
  const location = useLocation(); // Obter a localização atual

  // Verificar se a rota atual é `/login` ou `/register`
  const showNavigation = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {/* Mostrar o componente de navegação se não estiver nas rotas de login ou registro */}
      {showNavigation && <Navegacao />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* Outras rotas aqui */}
      </Routes>
    </>
  );
};

export default AppRoutes;
