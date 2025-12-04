import React, { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Lazy-load route components to reduce initial bundle size
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const Player = lazy(() => import('./pages/Player/Player'));

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    // Dynamically import firebase auth to keep it out of the initial bundle
    (async () => {
      try {
        const [{ auth }, { onAuthStateChanged }] = await Promise.all([
          import('./firebase'),
          import('firebase/auth'),
        ]);

        unsubscribe = onAuthStateChanged(auth, (user) => {
          setAuthChecked(true);
          const from = location.state?.from || '/';

          if (user) {
            if (location.pathname === '/login') {
              navigate(from, { replace: true });
            }
          } else {
            if (location.pathname !== '/login') {
              navigate('/login', { state: { from: location.pathname }, replace: true });
            }
          }
        });
      } catch (err) {
        // If dynamic import fails, allow app to continue and show login route
        console.error('Auth import failed:', err);
        setAuthChecked(true);
      }
    })();

    return () => {
      try {
        unsubscribe && unsubscribe();
      } catch (e) {
        // noop
      }
    };
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
