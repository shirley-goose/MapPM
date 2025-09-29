import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAPI = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // API tokens are now handled automatically by the axios interceptor
    // No manual token management needed
  }, [isAuthenticated]);
};