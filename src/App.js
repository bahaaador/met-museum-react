import React, { useEffect, useState, useReducer, lazy, Suspense } from "react";
import { ObjectCardGridComponent } from "components/ObjectCardGridComponent";

import "./App.css";
import { useSpring, animated } from "react-spring";
import { config } from "@react-spring/web";
import { ReactComponent as Loading } from "./assets/loading.svg";
import {
  appReducer,
  SET_KEYWORD,
  SET_RESULT,
  DEFAULT_SEARCH_RESULT,
  INITIAL_STATE,
} from "./AppReducer";

function App() {
  const [timeoutToken, setTimeoutToken] = useState(null);

  const [appState, dispatch] = useReducer(
    appReducer,
    INITIAL_STATE
  );

function App() {
  const [timeoutToken, setTimeoutToken] = useState(null); //todo useRef

  const [appState, dispatch] = useReducer(appReducer, INITIAL_STATE);

  const setSearchResultAction = (result) => {
    dispatch({ type: SET_RESULT, payload: result });
  };

  const setKeywordAction = result => {
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

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } })
  const titleAnimateProps = useSpring({ width: 450, config: { duration: 800 }, from: { width: 0 } })

  return (
    <animated.div style={fadeInProps} className="App">
      <animated.h1 style={titleAnimateProps}>🏛 Metropolitan Museum of Art</animated.h1>
      <input
        type="search"
        placeholder="Enter keyword here..."
        onChange={e => setKeywordDebounced(e.target.value)}
        ref={input => input && input.focus()}
        aria-label="search term"
      />
      {isLoading ? (
        <Loading />
      ) : (
          <>
            <ResultsCaption style={fadeInProps} total={searchResult.total} keyword={keyword} />
            <div >
              { // break the results into chuncks of 200 items so that we can optimize performance by assigning
                // intersection observer to items in each chunk based on current scroll position at any given time
                chunk(searchResult.objectIDs, 200).map(ids =>
                  <LazyLoadedObjectListComponent key={ids[0]} data={ids} />
                )}
            </div>
          </>
        )}
    </animated.div>
  );
}

const ResultsCaption = ({ total, keyword, ...props }) =>
  keyword ? (
    <animated.span className="Search-Caption" {...props}>
      {total + ` results for: ` + keyword}
    </animated.span>
  ) : null;

export default App;