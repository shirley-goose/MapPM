import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<MapView />} />
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