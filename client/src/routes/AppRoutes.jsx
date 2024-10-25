import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Home from '../pages/Home';
const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Outras rotas aqui */}
    </Routes>
  </Router>
);

export default AppRoutes;
