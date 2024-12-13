require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const checkAndUpdateData = require ('./src/services/checkAndUpdateData')

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const userRoutes = require('./src/routes/userRoutes');
const platformRoutes = require('./src/routes/platformRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const PostRoutes = require('./src/routes/PostRoutes');

const Game = require('./src/models/Games');


// Criar o app Express e o servidor HTTP
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Configurações gerais
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/posts', PostRoutes);


// Servir arquivos estáticos
app.use('/images', express.static(path.join(__dirname, 'src/images')));

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Algo deu errado no servidor!' });
});

// Configuração do WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  socket.on('send_message', (data) => {
    // Enviar a mensagem para todos os conectados ou destinatário específico
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});




// Sincronizar o Sequelize e iniciar o servidor
sequelize
  .sync({ alter: false }) // Use alter para ajustar o banco sem perder dados
  .then(() => {
    console.log('Sincronização com o banco de dados concluída.');
    console.log('Verificando e atualizando dados iniciais...');
    return checkAndUpdateData(); // Certifique-se de que a função retorna uma Promise, se necessário
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao sincronizar ou iniciar o servidor:', err);
  });

