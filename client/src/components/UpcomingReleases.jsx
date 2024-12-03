import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './UpcomingReleases.css';

const UpcomingReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await axios.get('http://localhost:3000/api/games/upcoming');
        setReleases(response.data);
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  const handleMouseMove = (e) => {
    if (!carouselRef.current) return;

    const rect = carouselRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // Posição do mouse relativa ao contêiner
    const scrollArea = 500; // Área em pixels para ativar o scroll

    if (mouseX < scrollArea) {
      // Rolar para a esquerda
      carouselRef.current.scrollBy({ left: -1000, behavior: 'smooth' });
    } else if (mouseX > rect.width - scrollArea) {
      // Rolar para a direita
      carouselRef.current.scrollBy({ left: 1000, behavior: 'smooth' });
    }
  };

  const startScrolling = () => {
    setIsScrolling(true);
    document.addEventListener('mousemove', handleMouseMove);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
    document.removeEventListener('mousemove', handleMouseMove);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div
      className="releases-container"
      onMouseEnter={startScrolling}
      onMouseLeave={stopScrolling}
    >
      <h2>Calendário de Lançamentos</h2>
      <div className="releases-carousel" ref={carouselRef}>
        {releases.map((release) => (
          <div className="release-item" key={release.id}>
            <img
              src={release.image}
              alt={release.title}
              className="release-image"
            />
            <div className="release-info">
              <p className="release-title">{release.title}</p>
              <p className="release-date">{new Date(release.released).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
              })}</p>
              <div className="release-tags">
                {release.tags?.map((tag, index) => (
                  <span key={index} className={`release-tag ${tag.toLowerCase()}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingReleases;
