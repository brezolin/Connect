import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CommunityDetail.css';

const CommunityDetail = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/communities/${communityId}`);
        setCommunity(response.data);
        setPosts(response.data.posts || []);
        console.log(response.dat)
      } catch (error) {
        console.error('Erro ao carregar comunidade:', error);
      }
    };
    fetchCommunity();
  }, [communityId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Tentando criar um novo post...');
    console.log('Dados enviados:', {
      title: 'Novo Post',
      content: newPost,
      authorId: localStorage.getItem('user'),
      communityId: communityId
    });
  
    try {
      const response = await axios.post(
        `http://localhost:3000/api/communities/${communityId}/posts`,
        {
          title: 'Novo Post',
          content: newPost,
          authorId: localStorage.getItem('user'),
          communityId: communityId
        }
      );
  
      console.log('Resposta da API:', response.data);
  
      // Atualiza os posts no estado
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPost('');
  
      console.log('Post criado e estado atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao criar post:', error);
  
      if (error.response) {
        // Resposta da API com status de erro
        console.error('Erro na resposta da API:', error.response.data);
      } else if (error.request) {
        // Nenhuma resposta do servidor
        console.error('Nenhuma resposta do servidor. Request:', error.request);
      } else {
        // Erro ao configurar a requisição
        console.error('Erro ao configurar a requisição:', error.message);
      }
    }
  };

  return (
    <div className="community-detail">
      {community ? (
        <>
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          <h2>Posts</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Escreva um post..."
              required
            />
            <button type="submit">Postar</button>
          </form>
        </>
      ) : (
        <p>Carregando comunidade...</p>
      )}
    </div>
  );
};

export default CommunityDetail;
