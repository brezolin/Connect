const bcrypt = require('bcryptjs');
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verifica se o e-mail já existe
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário!' });
  }
};

module.exports = { registerUser };
