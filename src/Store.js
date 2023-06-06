import { create } from "zustand";

const INITIAL_STATE = {
  keyword: "",
  isLoading: false,
  total: 0,
  objectIDs: [],
};

export const useMetStore = create((set, get) => ({
  keyword: INITIAL_STATE.keyword,
  total: INITIAL_STATE.total,
  objectIDs: INITIAL_STATE.objectIDs,
  isLoading: false,
  detailsModalOpen: false,
  detailsModalData: {},

  setKeyword: (keyword) =>
    set((state) => ({
      keyword,
      objectIDs: INITIAL_STATE.objectIDs,
      total: INITIAL_STATE.total,
    })),
  setdetailsModalOpen: (open) => set((state) => ({ detailsModalOpen: open })),
  setdetailsModaldata: (data) =>
    set((state) => ({ kedetailsModalDatayword: data })),

  fetchResult: async () => {
    set({ isLoading: true });
    await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${
        get().keyword
      }`
    )
      .then((response) => response.json())
      .then((data) => set({ objectIDs: data.objectIDs, total: data.total }))
      .finally(() => set({ isLoading: false }));
  },
}));
