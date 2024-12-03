import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Feed.css';
import Spinner from './Spinner';

const Feed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const carouselRef = useRef(null);
  const scrollArea = 500;

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await axios.get('http://localhost:3000/api/news');
        setNews(response.data);
      } catch (err) {
        setError('Erro ao carregar notícias. Tente novamente mais tarde.');
        console.error('Erro ao carregar notícias:', err.message || err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const handleMouseMove = (e) => {
    if (!carouselRef.current) return;

    const rect = carouselRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    if (mouseX < scrollArea) {
      carouselRef.current.scrollBy({ left: -1000, behavior: 'smooth' });
    } else if (mouseX > rect.width - scrollArea) {
      carouselRef.current.scrollBy({ left: 1000, behavior: 'smooth' });
    }
  };

  const startScrolling = () => {
    document.addEventListener('mousemove', handleMouseMove);
  };

  const stopScrolling = () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };

  if (loading) return <Spinner />;
  if (error)
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );

  return (
    <div
      className="feed-container"
      onMouseEnter={startScrolling}
      onMouseLeave={stopScrolling}
    >
      <h1>Jogos Relevantes</h1>
      <div ref={carouselRef} className="feed-grid">
        {news.map((item) => (
          <div
            key={item.id}
            className="feed-item"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
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
                  loading="lazy"
                  src={item.image}
                  alt={`Imagem do jogo ${item.title}`}
                  className="feed-image"
                />
              )}
            </div>
            <div className="feed-content">
              <h2>{item.title}</h2>
              <p>
                <strong>Lançado em:</strong>{' '}
                {new Date(item.released).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
              <p>
                <strong>Gêneros:</strong>{' '}
                {Array.isArray(item.genres)
                  ? item.genres.join(', ')
                  : item.genres || 'Não especificado'}
              </p>
              <p>
                <strong>Plataformas:</strong>{' '}
                {item.platforms || 'Não especificado'}
              </p>
              <p>
                <strong>Avaliação:</strong> {item.rating} / 5 ({item.reviewsCount}{' '}
                reviews)
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feed-link"
              >
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
