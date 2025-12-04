import React from 'react';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import hero_banner from '../../assets/hero_banner.jpg';
import hero_title from '../../assets/hero_title.png';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitleCards/TitleCards';
import Footer from '../../components/Footer/Footer';

function Home() {
  return (
    <div className='home'>
      <Navbar />
      <div className="hero">
        <img src={hero_banner} alt="" className='banner-img' />
        <div className='hero-caption'>
          <img src={hero_title} alt="" className='caption-img' />
          <p>
            Discovering his ties to a secret ancient order, a young man
            living in modern Istanbul embarks on a quest to save the city.
          </p>
          <div className="hero-btns">
            <button className="btns">
              <img src={play_icon} alt="" /> Play
            </button>
            <button className="hero-btn info">
              <img src={info_icon} alt="Info" />
              More Info
            </button>
          </div>
          {/* Now Playing moved below hero to avoid layout issues from the absolutely-positioned caption */}
        </div>
      </div>

      <div className="more-cards">
        <TitleCards title="Now Playing" category="now_playing" />
        <TitleCards title="Trending Now" category="trending" />
        <TitleCards title="Blockbuster Movies" category="popular" />
        <TitleCards title="Upcoming" category="upcoming" />
        <TitleCards title="Top Picks for You" category="top_rated" />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
