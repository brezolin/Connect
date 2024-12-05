import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CommunityDetail.css';

const CommunityDetail = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar detalhes da comunidade
  const fetchCommunity = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.get(
        `http://localhost:3000/api/communities/${communityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setCommunity(response.data);
      setPosts(response.data.posts || []);
  
      // Verifica se o usuário é membro da comunidade
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Decodifica o ID do usuário do token
      const isUserMember = response.data.members.some((member) => member.id === userId);
      setIsMember(isUserMember);
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Você não está autenticado. Faça login novamente.'
          : 'Erro ao carregar comunidade. Tente novamente mais tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para criar um post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      console.log('Token:', token); // Adicione este log para verificar o token
      

      const response = await axios.post(
        `http://localhost:3000/api/posts/${communityId}/posts`,
        {
          title: 'Novo Post',
          content: newPost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prevPosts) => [...prevPosts, response.data]);
      setNewPost('');
      alert('Post criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar o post:', err.response?.data || err.message);
      alert(
        err.response?.data?.error || 'Erro ao criar o post. Tente novamente mais tarde.'
      );
    }
  };


  // Função para entrar na comunidade
  const handleJoinCommunity = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar autenticado para entrar na comunidade.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/communities/${communityId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsMember(true);
      alert('Você entrou na comunidade com sucesso!');
    } catch (err) {
      alert('Erro ao entrar na comunidade. Tente novamente mais tarde.');
      console.error(err);
    }
  };

  // Carregar dados da comunidade ao montar o componente
  useEffect(() => {
    fetchCommunity();
  }, [communityId]);

  if (loading) {
    return <p>Carregando comunidade...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="community-detail">
      {community ? (
        <>
          <h1>{community.name}</h1>
          <p>{community.description}</p>
          {!isMember ? (
            <button onClick={handleJoinCommunity}>Entrar na Comunidade</button>
          ) : (
            <>
              <h2>Posts</h2>
              {posts.length === 0 ? (
                <p>Nenhum post disponível.</p>
              ) : (
                <ul>
                  {posts.map((post) => (
                    <li key={post.id} className="post-card">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                    </li>
                  ))}
                </ul>
              )}
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
          )}
        </>
      ) : (
        <p>Comunidade não encontrada.</p>
      )}
    </div>
  );
};

export default CommunityDetail;
