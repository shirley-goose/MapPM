import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';

// Configure Amplify with environment-specific redirect URLs
const isLocalhost = window.location.hostname === 'localhost';
const redirectUrl = isLocalhost
  ? 'http://localhost:3000/'
  : `https://${window.location.hostname}/`;

const updatedConfig = {
  ...amplifyconfig,
  oauth: {
    ...amplifyconfig.oauth,
    redirectSignIn: redirectUrl,
    redirectSignOut: redirectUrl,
  }
};

Amplify.configure(updatedConfig as any);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
