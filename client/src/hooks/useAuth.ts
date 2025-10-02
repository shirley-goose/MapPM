import { useState, useEffect } from 'react';
import { getCurrentUser, signInWithRedirect, signOut, fetchAuthSession } from 'aws-amplify/auth';

interface User {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.payload;

      if (currentUser && idToken) {
        setUser({
          sub: idToken.sub as string,
          email: idToken.email as string,
          name: idToken.name as string,
          picture: idToken.picture as string,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkUser,
  };
};
