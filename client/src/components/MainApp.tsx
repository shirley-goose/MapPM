import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import MapView from '../pages/MapView';
import Forum from '../pages/Forum';
import Resources from '../pages/Resources';
import Profile from '../pages/Profile';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to map after successful authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Check if we're coming from OAuth callback (has 'code' parameter)
      const urlParams = new URLSearchParams(window.location.search);
      const hasCode = urlParams.has('code');

      // Get current path without query parameters
      const currentPath = location.pathname;

      // Redirect to map if user is on root, dashboard, or coming from OAuth callback
      // Also redirect if they're on any non-specific authenticated page
      const shouldRedirectToMap = (
        currentPath === '/' ||
        currentPath === '/dashboard' ||
        hasCode ||
        !['/', '/map', '/forum', '/resources', '/profile'].includes(currentPath)
      );

      if (shouldRedirectToMap) {
        console.log('Redirecting to map after authentication from:', currentPath);
        navigate('/map', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<LandingPage />} />
          ) : (
            <>
              <Route path="/" element={<MapView />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
        </Routes>
      </main>
    </>
  );
};

export default MainApp;