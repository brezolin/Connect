import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Certifique-se de criar este arquivo CSS
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData);
      login(response.data.token, response.data.user); // Faz login automaticamente após o registro
      setMessage('Cadastro realizado com sucesso!');
      navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erro ao cadastrar. Tente novamente.');
    }
  };

  return (
    <div className="gamer-login-container">
      <div className="gamer-login-card">
        <h2 className="gamer-login-title">Cadastro</h2>
        <form onSubmit={handleSubmit} className="gamer-login-form">
          <input
            type="text"
            name="username"
            placeholder="Usuário"
            onChange={handleChange}
            required
            className="gamer-input-field"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="gamer-input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            onChange={handleChange}
            required
            className="gamer-input-field"
          />
          <button type="submit" className="gamer-submit-button">Registrar</button>
          {message && (
            <p
              className={`gamer-message ${
                message.includes('sucesso') ? 'success' : 'error'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
