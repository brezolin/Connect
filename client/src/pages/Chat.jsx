
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const Chat = ({ userId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/chat/${userId}/${otherUserId}`).then((response) => {
      setMessages(response.data);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receiveMessage');
  }, [userId, otherUserId]);

  const sendMessage = () => {
    const message = { senderId: userId, receiverId: otherUserId, content: newMessage };
    socket.emit('sendMessage', message);
    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === userId ? 'sent' : 'received'}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Digite uma mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default Chat;
