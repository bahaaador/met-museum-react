import { useCallback } from 'react';
import { useArtStore } from '@store/artStore';
import { useApi } from '@hooks/useApi';
import { fetchSearchResult } from '@api/museumApi';

export const useArtSearch = () => {
  const { setKeyword, setObjectIDs, setTotal } = useArtStore();
  const { execute, isLoading, error } = useApi(fetchSearchResult);

  const searchArtworks = useCallback(async (keyword) => {
    try {
      const result = await execute(keyword);
      setKeyword(keyword);
      setObjectIDs(result.objectIDs || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error('Error searching artworks:', err);
    }
  }, [execute, setKeyword, setObjectIDs, setTotal]);

  return {
    searchArtworks,
    isSearching: isLoading,
    error
  };
};