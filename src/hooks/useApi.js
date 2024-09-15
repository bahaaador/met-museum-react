import { useState, useCallback } from 'react';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (error) {
      setError(error.message || 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  return { execute, data, isLoading, error };
};