import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link, useLocation } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  const location = useLocation();

  const handleWheel = (e) => {
    e.preventDefault();
    cardsRef.current.scrollLeft += e.deltaY;
  };

  useEffect(() => {
    const BASE_URL = 'https://api.themoviedb.org/3';
    let endpoint = '';

    switch (category) {
      case 'trending':
        endpoint = `${BASE_URL}/trending/all/week`;
        break;
      case 'popular':
      case 'now_playing':
      case 'top_rated':
      case 'upcoming':
        endpoint = `${BASE_URL}/movie/${category}`;
        break;
      default:
        endpoint = `${BASE_URL}/movie/now_playing`;
    }

    fetch(endpoint, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('📦 Movie Data:', res);
        setApiData(res.results || []);
      })
      .catch((err) => console.error('API Error:', err));

    if (cardsRef.current) {
      cardsRef.current.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (cardsRef.current) {
        cardsRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [category]);

  const fallbackImage = 'https://via.placeholder.com/300x170?text=No+Image';

  return (
    <div className="title-cards">
      <h2>{title || 'Now Playing'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          const imagePath = card.backdrop_path || card.poster_path;
          const imageUrl = imagePath
            ? `https://image.tmdb.org/t/p/w500${imagePath}`
            : fallbackImage;

          console.log(`🎬 ${card.title || card.name}: ${imageUrl}`);

          return (
            <Link
              to={`/player/${card.id}`}
              state={{ from: location.pathname }}
              className="card"
              key={index}
            >
              <img src={imageUrl} alt={card.title || card.name} />
              <p>{card.title || card.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
