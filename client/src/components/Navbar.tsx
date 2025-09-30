import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Map', icon: '🗺️' },
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/forum', label: 'Forum', icon: '💬' },
    { path: '/resources', label: 'Resources', icon: '📚' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo192.png"
                alt="MapPM Logo"
                className="h-8 w-8"
              />
              <div className="font-bold text-xl">
                <span className="text-blue-900">Map</span>
                <span className="text-green-400">PM</span>
              </div>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={login}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <img
                    src={user?.picture || '/default-avatar.png'}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:block">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;