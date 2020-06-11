export const SET_KEYWORD = 'SET_KEYWORD';
export const SET_RESULT = 'SET_RESULT';

export const DEFAULT_SEARCH_RESULT = { total: 0, objectIDs: [] };
export const INITIAL_STATE = { keyword: '', isLoading: false, searchResult: DEFAULT_SEARCH_RESULT };

export const appReducer = (state, action) => {
    switch (action.type) {
      case SET_KEYWORD:
        return { ...state, isLoading: true, keyword: action.payload };
      case SET_RESULT:
        return { ...state, isLoading: false, searchResult: action.payload };
      default:
        return state;
    }
  };