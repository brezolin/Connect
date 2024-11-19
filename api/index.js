require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const userRoutes = require('./src/routes/userRoutes');
const platformRoutes = require('./src/routes/platformRoutes');


const port = 3000
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173'], // Adicione as origens permitidas
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permite o envio de cookies ou credenciais
};

app.use(cors(corsOptions));

app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de Games
app.use('/api', gameRoutes);

// Rotas de User
app.use('/api/users/', userRoutes);

// Outras configurações do app
app.use('/api/platforms', platformRoutes);

app.use('/api/games', gameRoutes);


// Configurar a pasta 'public' para servir arquivos estáticos
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// Middleware para tratamento de erros globais
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Algo deu errado no servidor!' });
});

// Variável de ambiente para a porta

sequelize.sync().then(async () => {
  console.log('Conectado ao banco de dados MySQL!');

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar com o banco de dados:', err);
});