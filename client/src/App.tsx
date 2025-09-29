import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0Provider from './auth/Auth0Provider';
import MainApp from './components/MainApp';

function App() {
  return (
    <Auth0Provider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <MainApp />
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;
