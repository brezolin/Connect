const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Chave secreta para assinar o JWT
const secretKey = process.env.JWT_SECRET;

// Função de login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Comparar a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Retornar o token e dados do usuário
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

// Função de registro
exports.register = async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, e-mail e senha são obrigatórios' });
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já está em uso' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo usuário
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      name: name || null, // Permitir que name seja opcional
    });

    // Gerar o token JWT para o novo usuário
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, secretKey, { expiresIn: '1h' });

    // Retornar o token e dados do novo usuário
    res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email, name: newUser.name } });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar o usuário' });
  }
};
