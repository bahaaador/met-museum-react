import React, { useEffect, useState, useReducer, lazy, Suspense } from "react";
import { useSpring, animated, Globals, useReducedMotion } from "react-spring";
import {
  appReducer,
  SET_KEYWORD,
  SET_RESULT,
  DEFAULT_SEARCH_RESULT,
  INITIAL_STATE,
} from "./AppReducer";

import "./App.css";

const ItemsGrid = lazy(() => import("./components/ItemsGrid"));

function App() {
  const [timeoutToken, setTimeoutToken] = useState(null); //todo useRef

  const [appState, dispatch] = useReducer(appReducer, INITIAL_STATE);

  const setSearchResultAction = (result) => {
    dispatch({ type: SET_RESULT, payload: result });
  };

  const setKeywordAction = (result) => {
    dispatch({ type: SET_KEYWORD, payload: result });
  };

  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = (keyword) => {
    clearTimeout(timeoutToken);
    var token = setTimeout(() => setKeywordAction(keyword), 400);
    setTimeoutToken(token);
  };

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  const { keyword, isLoading, searchResult } = appState;

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion, // disable all spring animations if user prefers reduced motions
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries

    const fetchData = async () => {
      if (!keyword) setSearchResultAction(DEFAULT_SEARCH_RESULT);
      else {
        try {
          var res = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`,
            {
              method: "GET",
              signal: abortController.signal,
              cache: "force-cache",
            }
          );

          var response = await res.json();

          if (!response.objectIDs) setSearchResultAction(DEFAULT_SEARCH_RESULT);
          else setSearchResultAction(response);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Fetch aborted 👀");
            console.dir(err);
          } else {
            console.error("Error connecting to the API.", err.message);
          }
        }
      }
    };

    fetchData();

    return function cleanup() {
      abortController.abort();
    };
  }, [keyword]);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const titleAnimateProps = useSpring({
    width: "100vw",
    config: { duration: 800 },
    from: { width: "0vw" },
  });

  return (
    <animated.div style={fadeInProps} className="app">
      <animated.h1 style={titleAnimateProps}>
        🏛 Metropolitan Museum of Art
      </animated.h1>
      <input
        type="search"
        placeholder="Enter keyword here..."
        onChange={(e) => setKeywordDebounced(e.target.value)}
        aria-label="search term"
      />
      <Suspense fallback={<LoadingIndicator />}>
        {
          // display loading indicator when loading components, also when fetching data from api
        }
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <ResultsCaption
              style={fadeInProps}
              total={searchResult.total}
              keyword={keyword}
            />
            <div>
              {
                // break the results into chuncks of 200 items so that we can optimize performance by assigning
                // intersection observer to items in each chunk based on current scroll position at any given time
                chunk(searchResult.objectIDs, 200).map((ids) => (
                  <ItemsGrid key={ids[0]} data={ids} />
                ))
              }
            </div>
          </>
        )}
      </Suspense>
    </animated.div>
  );
}

const LoadingIndicator = () => <div className="loading"></div>;

const ResultsCaption = ({ total, keyword, ...props }) =>
  keyword ? (
    <animated.span className="search-caption" {...props}>
      {total + ` results for: ` + keyword}
    </animated.span>
  ) : null;

export default App;
