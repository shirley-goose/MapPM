import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainApp from './components/MainApp';

function App() {
  return (
    <Router basename="/mappm">
      <div className="min-h-screen bg-gray-50">
        <MainApp />
      </div>
    </Router>
  );
}

export default App;
