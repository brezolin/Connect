import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setMessage('Todos os campos são obrigatórios');
      setError(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      setMessage('Cadastro realizado com sucesso!');
      setError(false);
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Erro ao cadastrar!');
      setError(true);
    }
  };

  return (
    <div className="register-container">
      <h2>Cadastro</h2>
      {message && (
        <p className={`message ${error ? 'error' : 'success'}`}>{message}</p>
      )}
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Nome de usuário:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit" className="register-button">Cadastrar</button>
      </form>
      <div>
        Já tem uma conta? <a href="/login">Faça login</a>
      </div>
    </div>
  );
};

export default Register;
