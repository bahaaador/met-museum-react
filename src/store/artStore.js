import { create } from "zustand";
import { fetchArtifactDetails, fetchSearchResult } from "@api/museumApi";
import { useArtSearch } from "@/hooks/useArtSearch";
import { subscribeWithSelector } from "zustand/middleware";

const INITIAL_STATE = {
  keyword: "",
  isLoading: false,
  total: 0,
  objectIDs: [],
  cardData: [],
  detailsModalOpen: false,
};

const CACHE_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day

export const useArtStore = create((set, get) => ({
  ...INITIAL_STATE,
  detailsModalData: {},
  abortController: new AbortController(),
  error: null,
  artifactCache: {},
  // UI STATE
  reset: () => set(INITIAL_STATE),
  // set keyword and search
  setKeyword: (keyword) => {
    // abort any ongoing requests
    get().abortController.abort();
    set({ abortController: new AbortController() });

    set(() => ({ ...INITIAL_STATE, keyword }));
    if (keyword) {
      get().performSearch(keyword, get().abortController.signal);
    }
  },
  setObjectIDs: (objectIDs) => set(() => ({ objectIDs })),
  setTotal: (total) => set(() => ({ total })),
  setDetailsModalOpen: (open) => set(() => ({ detailsModalOpen: open })),
  setDetailsModalData: (data) =>
    set(() => ({ detailsModalOpen: true, detailsModalData: data })), // open modal as soon as data is set

  // CACHE
  addToCache: (id, details) =>
    set((state) => ({
      artifactCache: {
        ...state.artifactCache,
        [id]: {
          data: details,
          timestamp: Date.now(),
        },
      },
    })),

  getFromCache: (id) => {
    const state = get();
    const cachedItem = state.artifactCache[id];

    return cachedItem;
  },

  getAllArtifacts: () => {
    const { artifactCache } = get();
    return Object.values(artifactCache);
  },

  // API CALLS
  performSearch: async (keyword, signal) => {
    set({ isLoading: true, error: null });
    try {
      const results = await fetchSearchResult(keyword, signal);
      set({
        cardData: results.artworks,
        total: results.total,
        objectIDs: results.objectIDs,
        isLoading: false,
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Old search aborted 👀", { keyword });
        return null;
      }
      set({ error: error.message, isLoading: false });
    }
  },

  getArtifactDetails: async (id, signal) => {
    const { getFromCache, addToCache } = get();

    // Check if data is in cache and not stale
    const cachedData = getFromCache(id);
    if (
      cachedData &&
      cachedData.timestamp &&
      cachedData.timestamp > Date.now() - CACHE_EXPIRATION_TIME
    ) {
      return cachedData.data;
    } else {
      try {
        console.log("fetching new data", { id });
        const newData = await fetchArtifactDetails(id, signal);

        // Store the new data in cache
        addToCache(id, newData);
        return newData;
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch details aborted 👀", { id });
          return null;
        }
        console.error("Error fetching artifact details:", error);
        throw error;
      }
    }
  },
}));

export const getArtState = useArtStore.getState;
