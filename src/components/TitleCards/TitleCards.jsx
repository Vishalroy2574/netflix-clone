import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link, useLocation } from 'react-router-dom';
import cards_data from '../../assets/cards/Cards_data';

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();
  const location = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Return different slices of local cards for each category so sections don't all look identical
  const getLocalData = (cat) => {
    const total = cards_data.length;
    const slice = (start, len) =>
      cards_data.slice(start, start + len).map((c, i) => ({ id: `local-${start + i}`, local_image: c.image, title: c.name }));

    switch (cat) {
      case 'trending':
        return slice(0, Math.min(5, total));
      case 'popular':
        return slice(5, Math.min(5, total - 5));
      case 'upcoming':
        return slice(10, Math.min(4, total - 10));
      case 'top_rated':
        return slice(2, Math.min(5, total - 2));
      case 'now_playing':
      default:
        return slice(0, Math.min(5, total));
    }
  };

  const handleWheel = (e) => {
    // convert vertical wheel to horizontal scroll, but allow natural horizontal touchpad behavior
    if (Math.abs(e.deltaX) > 0) return; // let natural horizontal scrolling occur
    e.preventDefault();
    cardsRef.current.scrollLeft += e.deltaY;
  };

  const scrollByAmount = (amount) => {
    if (!cardsRef.current) return;
    cardsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (!cardsRef.current) return;
    const w = cardsRef.current.clientWidth || 800;
    scrollByAmount(-Math.round(w * 0.8));
  };

  const handleNext = () => {
    if (!cardsRef.current) return;
    const w = cardsRef.current.clientWidth || 800;
    scrollByAmount(Math.round(w * 0.8));
  };

  // Pointer drag handlers (mouse + touch)
  const onPointerDown = (clientX) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartScroll.current = cardsRef.current ? cardsRef.current.scrollLeft : 0;
  };

  const onPointerMove = (clientX) => {
    if (!isDragging || !cardsRef.current) return;
    const dx = clientX - dragStartX.current;
    cardsRef.current.scrollLeft = dragStartScroll.current - dx;
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const BASE_URL = 'https://api.themoviedb.org/3';
    let endpoint = '';

    // If no TMDB token is provided in env, use local fallback data
    const token = import.meta.env.VITE_TMDB_TOKEN;
    if (!token) {
      console.warn('VITE_TMDB_TOKEN not set — using local cards_data fallback');
      setApiData(getLocalData(category));
      // continue to attach wheel listener below
    }

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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`TMDB API responded ${res.status}`);
        return res.json();
      })
      .then((res) => {
        console.log('📦 Movie Data:', res);
        if (res && Array.isArray(res.results) && res.results.length > 0) {
          setApiData(res.results);
        } else {
          // fallback to local cards if API returned no results
          setApiData(getLocalData(category));
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
        setApiData(getLocalData(category));
      });

    if (cardsRef.current) {
      cardsRef.current.addEventListener('wheel', handleWheel, { passive: false });
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
      <div className="card-list-wrapper">
        <button aria-label="Previous" className="nav-arrow prev" onClick={handlePrev}>
          ‹
        </button>
        <div
          className="card-list"
          ref={cardsRef}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={onPointerUp}
        >
          {apiData.map((card, index) => {
            const tmdbPath = card.backdrop_path || card.poster_path;
            const imageUrl = card.local_image
              ? card.local_image
              : tmdbPath
              ? `https://image.tmdb.org/t/p/w500${tmdbPath}`
              : fallbackImage;

            console.log(`🎬 ${card.title || card.name}: ${imageUrl}`);

            return (
              <Link
                to={`/player/${card.id || `local-${index}`}`}
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
        <button aria-label="Next" className="nav-arrow next" onClick={handleNext}>
          ›
        </button>
      </div>
    </div>
  );
};

export default TitleCards;
