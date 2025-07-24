import React from 'react';
import './Navbar.css';
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from '../../firebase';
import { useNavigate } from 'react-router-dom'; // import navigate

const Navbar = () => {
  const navigate = useNavigate(); // hook

  const handleLogout = async () => {
    try {
      await logout();         // sign out user
      navigate('/login');     // redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img src={logo} alt="" />
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Language</li>
        </ul>
      </div>
      <div className='navbar-right'>
        <img src={search_icon} alt="search" />
        <p>Children</p>
        <img src={bell_icon} alt="bell" />
        <div className="navbar-profile">
          <img src={profile_img} alt="profile" className="profile" />
          <img src={caret_icon} alt="caret" />
          <div className='dropdown'>
            <p onClick={handleLogout}>Sign out of Netflix</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
