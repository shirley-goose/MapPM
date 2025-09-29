import React from 'react';
import { Auth0Provider as Provider } from '@auth0/auth0-react';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    throw new Error('Auth0 domain and client ID must be provided');
  }

  return (
    <Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email"
      }}
    >
      {children}
    </Provider>
  );
};

export default Auth0Provider;