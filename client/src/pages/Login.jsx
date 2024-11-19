import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', formData);
      login(response.data.token, response.data.user); // Atualiza o estado global com token e dados do usuário
      setMessage('Login bem-sucedido!');
      navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="gamer-login-container">
      <div className="gamer-login-card">
        <h2 className="gamer-login-title">Login</h2>
        <form onSubmit={handleSubmit} className="gamer-login-form">
          <input
            type="email"
            name="email"
            placeholder="Digite seu email"
            onChange={handleChange}
            required
            className="gamer-input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Digite sua senha"
            onChange={handleChange}
            required
            className="gamer-input-field"
          />
          <button type="submit" className="gamer-submit-button">Entrar</button>
          {message && (
            <p
              className={`gamer-message ${
                message.includes('bem-sucedido') ? 'success' : 'error'
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <Link to="/register" className="gamer-register-link">
          Não possui conta? Registre-se
        </Link>
      </div>
    </div>
  );
};

export default Login;
