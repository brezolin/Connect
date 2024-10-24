import { useState } from 'react';
import axios from 'axios';
import "./login.css"
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      setMessage(response.data.message || 'Login realizado com sucesso!');
      setFormData({ email: '', password: '' });
      // Redirecionar ou realizar outras ações aqui após o login
    } catch (error) {
      setMessage(error.response.data.error || 'Erro ao realizar o login!');
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
    </div>
  );
};

export default Login;
