import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      const from = location.state?.from || '/';

      if (user) {
        // After login, redirect to the previous path
        if (location.pathname === '/login') {
          navigate(from, { replace: true });
        }
      } else {
        // Redirect to login and save where user came from
        if (location.pathname !== '/login') {
          navigate('/login', { state: { from: location.pathname }, replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  if (!authChecked) return null; // Prevent route flicker

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/player/:id" element={<Player />} />
      <Route path="/home" element={<Home />} /> {/* Optional: catch /home */}
    </Routes>
  );
};

export default App;
