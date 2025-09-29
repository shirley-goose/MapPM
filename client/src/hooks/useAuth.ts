import { useState, useEffect } from 'react';
import { getCurrentUser, signOut, fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();

    // Listen for auth events
    const hubListener = Hub.listen('auth', ({ payload }) => {
      console.log('Auth event:', payload.event);
      switch (payload.event) {
        case 'signInWithRedirect':
          console.log('Sign in redirect successful - user authenticated via Cognito');
          checkAuthState();
          break;
        case 'signInWithRedirect_failure':
          console.error('Sign in failure:', payload.data);
          setIsLoading(false);
          break;
        case 'customOAuthState':
          console.log('Custom OAuth state received from Cognito');
          checkAuthState();
          break;
        case 'signedIn':
          console.log('User signed in via Cognito');
          checkAuthState();
          break;
        case 'tokenRefresh':
          console.log('Token refreshed');
          break;
      }
    });

    return () => hubListener();
  }, []);

  const checkAuthState = async () => {
    try {
      // Check if we have an authorization code in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        console.log('Authorization code detected, processing...');
        setIsLoading(true);
        // Give Amplify time to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      setUser({
        name: currentUser.username,
        email: currentUser.signInDetails?.loginId || '',
        picture: null, // Cognito doesn't provide pictures by default
      });
      setIsAuthenticated(true);

      // Clean up the URL after successful authentication and trigger navigation
      if (code) {
        console.log('OAuth callback processed successfully, cleaning URL');
        window.history.replaceState({}, document.title, window.location.pathname);
        // Force a small delay to ensure the auth state is fully set before navigation
        setTimeout(() => {
          console.log('Auth state fully processed, ready for navigation');
        }, 100);
      }
    } catch (error) {
      console.log('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      console.log('Initiating sign in with Cognito hosted UI...');
      await signInWithRedirect();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getToken = async () => {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString() || null;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
  };
};