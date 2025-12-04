import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-icons">

        {/* Facebook */}
        <a 
          href="https://www.facebook.com/profile.php?id=100015089837481" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={facebook_icon} alt="Facebook"/>
        </a>

        {/* Instagram */}
        <a 
          href="https://www.instagram.com/__vishal_roy_74__/?hl=en" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={instagram_icon} alt="Instagram"/>
        </a>

        {/* Twitter/X */}
        <a 
          href="https://twitter.com/login" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={twitter_icon} alt="Twitter"/>
        </a>

        {/* YouTube */}
        <a 
          href="https://www.youtube.com/signin" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img src={youtube_icon} alt="YouTube"/>
        </a>

      </div>

      <ul>
        <li>Audio Description</li>
        <li>Help Centre</li>
        <li>Gift Cards</li>
        <li>Media Centre</li>
        <li>Investor Relations</li>
        <li>Jobs</li>
        <li>Terms of Use</li>
        <li>Privacy</li>
        <li>Legal Notice</li>
        <li>Cookie preferences</li>
        <li>Corporate Information</li>
        <li>Contact Us</li>
      </ul>

      <p className='copyright-text'>© 1997-2023</p>
    </div>
  )
}

export default Footer
