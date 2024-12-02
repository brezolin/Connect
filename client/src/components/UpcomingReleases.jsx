import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpcomingReleases.css';

const UpcomingReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await axios.get('http://localhost:3000/api/games//upcoming');
        setReleases(response.data);
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReleases();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="releases-container">
      <h2>Calendário de Lançamentos</h2>
      <div className="releases-carousel">
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
                month: 'short',
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
