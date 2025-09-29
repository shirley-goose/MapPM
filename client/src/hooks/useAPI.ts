import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { setAuthToken, removeAuthToken } from '../utils/api';

export const useAPI = () => {
  const { getToken, isAuthenticated } = useAuth();

  useEffect(() => {
    const setupAuthInterceptor = async () => {
      if (isAuthenticated) {
        try {
          const token = await getToken();
          if (token) {
            setAuthToken(token);
          }
        } catch (error) {
          console.error('Error setting auth token:', error);
          removeAuthToken();
        }
      } else {
        removeAuthToken();
      }
    };

    setupAuthInterceptor();
  }, [isAuthenticated, getToken]);
};