import { fetchMetCollection } from "api/metMusuem";
import { create } from "zustand";

const INITIAL_STATE = {
  keyword: "",
  isLoading: false,
  total: 0,
  objectIDs: [],
};

export const useMetStore = create((set, get) => ({
  ...INITIAL_STATE,
  detailsModalOpen: false,
  detailsModalData: {},
  abortController: new AbortController(),

  setKeyword: (keyword) =>
    set(() => ({
      ...INITIAL_STATE, // reset state when keyword updated
      keyword,
    })),
  setDetailsModalOpen: (open) => set(() => ({ detailsModalOpen: open })),
  setDetailsModalData: (data) =>
    set(() => ({ detailsModalOpen: true, detailsModalData: data })), // open modal as soon as data is set

  fetchResult: async () => {
    get().abortController.abort(); // cancel the previous request
    set({ isLoading: true });

    try {
      const data = await fetchMetCollection(
        get().keyword,
        get().abortController.signal
      );

      set({ objectIDs: data.objectIDs, total: data.total });
    } catch (error) {
      console.error(error); // TODO: add error state and update UI accordingly to communicate it to the user
    } finally {
      set({ isLoading: false });
    }
  },
}));
