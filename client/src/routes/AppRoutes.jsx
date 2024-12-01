import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
import UserProfile from '../pages/UserProfile';
import Navigation from '../components/Navegacao';
import { AuthContext } from '../context/AuthContext';
import Chat from '../pages/Chat';
import Friends from '../pages/Friends';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? children : <Navigate to="/home" />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      {/* Navegação exibida apenas se o usuário estiver autenticado */}
      {isAuthenticated && <Navigation />}
      <Routes>
        {/* Rotas Públicas com redirecionamento se autenticado */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rotas Protegidas */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />


        {/* Redirecionamento padrão */}
      
      </Routes>
    </Router>
  );
};

export default AppRoutes;
