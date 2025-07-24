import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useParams, useNavigate } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
    }
  };

  useEffect(() => {
    setLoading(true); // Start loading

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(data => {
        if (!data.results || data.results.length === 0) {
          setError("No trailer available");
          setLoading(false);
          return;
        }

        const officialTrailer = data.results.find(
          vid => vid.site === 'YouTube' && vid.type === 'Trailer' && vid.official === true
        );
        const fallbackTrailer = data.results.find(
          vid => vid.site === 'YouTube' && vid.type === 'Trailer'
        );
        const anyYouTubeVideo = data.results.find(
          vid => vid.site === 'YouTube'
        );

        setVideo(officialTrailer || fallbackTrailer || anyYouTubeVideo);
        setLoading(false);
      })
      .catch(err => {
        console.error('Video Fetch Error:', err);
        setError('Failed to load trailer');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        className="back-btn"
        onClick={() => navigate(-1)}
      />

      {loading ? (
        <p style={{ color: 'white' }}>Loading trailer...</p>
      ) : video ? (
        <>
          <iframe
            width="90%"
            height="90%"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1`}
            title={video.name}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>

          <div className="player-info">
            <p><strong>Publish Date:</strong> {video.published_at?.slice(0, 10) || 'N/A'}</p>
            <p><strong>Title:</strong> {video.name}</p>
            <p><strong>Type:</strong> {video.type}</p>
          </div>
        </>
      ) : (
        <p style={{ color: 'white' }}>{error}</p>
      )}
    </div>
  );
};

export default Player;
