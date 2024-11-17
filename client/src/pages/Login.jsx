import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/users/login', formData); // Certifique-se de que o URL está correto
      const { token } = response.data;

      localStorage.setItem('token', token); // Armazenar o token JWT no localStorage
      setMessage('Login realizado com sucesso!');

      // Redireciona para a página inicial ou outra página
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erro ao realizar login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">Entrar</button>
      </form>
      <div className="register-link">
        <p>Não tem uma conta? <Link to="/register">Registre-se aqui</Link></p>
      </div>
    </div>
  );
};

export default Login;
