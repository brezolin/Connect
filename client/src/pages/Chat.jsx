import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './Chat.css';

// Configuração do WebSocket
const socket = io('http://localhost:3000');

const Chat = () => {
  const { friendId } = useParams(); // ID do amigo atual
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]); // Lista de amigos
  const userId = Number(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });

  // Menu de contexto para exclusão de mensagens
  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, messageId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, messageId: null });
  };

  // Buscar todas as conversas do usuário
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/conversations/${userId}`
        );
        setConversations(response.data); // Agora contém objetos { id, username }
      } catch (error) {
        console.error('Erro ao buscar conversas:', error);
      }
    }
    fetchConversations();
  }, [userId]);

  // Buscar mensagens da conversa atual
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/${userId}/${friendId}`
        );
        setMessages(response.data);

        // Limpar notificações do backend
        await axios.post(`http://localhost:3000/api/chat/clear-notifications`, {
          userId,
          friendId,
        });
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setMessages([]);
      }
    }
    if (friendId) {
      fetchMessages();
    }
  }, [userId, friendId]);

  // Atualizar mensagens em tempo real
  useEffect(() => {
    socket.on('receive_message', (message) => {
      // Verifica se a mensagem pertence ao chat atual
      if (
        (message.senderId === userId && message.receiverId === Number(friendId)) ||
        (message.senderId === Number(friendId) && message.receiverId === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [friendId, userId]);

  const sendMessage = async () => {
    const messageData = {
      senderId: userId,
      receiverId: Number(friendId),
      content: messageInput,
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/chat/send',
        messageData
      );
      if (response.data) {
        socket.emit('send_message', response.data);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessageInput('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  // Excluir uma mensagem individual
  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:3000/api/chat/message/${messageId}`);
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      handleCloseContextMenu();
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
    }
  };

  // Excluir toda a conversa
  const deleteConversation = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/chat/conversation/${userId}/${friendId}`);
      setMessages([]);
      navigate('/chat');
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
    }
  };

  return (
    <div className="chat-container">
      {/* Lista de Conversas */}
      {!friendId && conversations.length > 0 && (
        <div className="conversations-list">
          <h3>Conversas</h3>
          <ul>
            {conversations.map((friend) => (
              <li
                key={friend.id}
                onClick={() => navigate(`/chat/${friend.id}`)}
              >
                {friend.username}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Atual */}
      {friendId && (
        <div className="chat-window">
          <div className="chat-header">
            <h1>
              Chat com{' '}
              {conversations.find((friend) => friend.id === Number(friendId))?.username || 'Amigo'}
            </h1>
            <button 
              onClick={() => navigate('/chat')}
              className="back-button"
            >
              Voltar para conversas
            </button>
            <button 
              onClick={deleteConversation}
              className="delete-conversation-button"
            >
              Apagar Conversa
            </button>
          </div>

          <div className="messages-container">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === userId ? 'message-sent' : 'message-received'}`}
                  onContextMenu={(e) => handleContextMenu(e, msg.id)} // Menu de contexto
                >
                  <span>{msg.content}</span>
                </div>
              ))
            ) : (
              <p className="no-messages">
                Nenhuma mensagem disponível.
              </p>
            )}
          </div>

          {/* Menu de Contexto */}
          {contextMenu.visible && (
            <div
              style={{
                position: 'absolute',
                top: contextMenu.y,
                left: contextMenu.x,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                zIndex: 1000,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                padding: '10px',
              }}
              onMouseLeave={handleCloseContextMenu}
            >
              <button
                onClick={() => deleteMessage(contextMenu.messageId)}
                className="context-menu"
              >
                Excluir Mensagem
              </button>
            </div>
          )}

          <div className="message-input-container">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite sua mensagem"
              className="message-input"
            />
            <button
              onClick={sendMessage}
              className="send-button"
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* Tela inicial sem conversas */}
      {!friendId && conversations.length === 0 && (
        <div className="empty-chat">
          <p>Você não tem conversas no momento.</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
