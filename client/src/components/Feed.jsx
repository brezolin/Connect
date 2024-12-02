import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css';
import Spinner from './Spinner';

const Feed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null); // Para controlar o item com o mouse acima

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await axios.get('http://localhost:3000/api/news');
        setNews(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Erro ao carregar notícias. Tente novamente mais tarde.');
        console.error('Erro ao carregar notícias:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="feed-container">
      <h1>Jogos Relevantes</h1>
      <div className="feed-grid">
        {news.map((item) => (
          <div
            key={item.id}
            className="feed-item"
            onMouseEnter={() => setHoveredItem(item.id)} // Define o item como hovered
            onMouseLeave={() => setHoveredItem(null)} // Remove o hover
          >
            <div className="feed-media">
              {hoveredItem === item.id && item.trailer ? (
                item.trailer.includes('youtube.com') ? (
                  <iframe
                    className="feed-trailer"
                    src={`https://www.youtube.com/embed/${new URL(item.trailer).searchParams.get('v')}?autoplay=1&mute=1`}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={item.trailer}
                    muted
                    loop
                    autoPlay
                    className="feed-trailer"
                  />
                )
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  className="feed-image"
                />
              )}
            </div>
            <div className="feed-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p><strong>Lançado em:</strong> {item.released}</p>
              <p><strong>Gêneros:</strong> {Array.isArray(item.genres) ? item.genres.join(', ') : item.genres || 'Não especificado'}</p>
              <p><strong>Plataformas:</strong> {item.platforms || 'Não especificado'}</p>
              <p><strong>Avaliação:</strong> {item.rating} / 5 ({item.reviewsCount} reviews)</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="feed-link">
                Saiba mais
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
