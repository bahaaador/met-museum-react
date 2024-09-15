import { useArtStore } from '../store/artStore';
import { fetchArtifactDetails } from '../api/artifactApi'; // Assume this function exists

export function useArtDetails(artifactId) {
  const { getFromCache, addToCache } = useArtStore();

const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


  const getArtifactDetails = async () => {
    // Check if data is in cache and not stale
    const cachedData = getFromCache(artifactId);
    if (cachedData && cachedData.timestamp && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
      return cachedData.data;
    }

    // If not in cache or stale, fetch new data
    try {
      const newData = await fetchArtifactDetails(artifactId);
      // Store the new data in cache
      addToCache(artifactId, newData);
      return newData;
    } catch (error) {
      console.error('Error fetching artifact details:', error);
      throw error;
    }
  };

  return { getArtifactDetails };
}
