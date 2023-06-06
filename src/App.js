import React, { useEffect, useState, lazy, Suspense } from "react";
import { useSpring, animated, Globals, useReducedMotion } from "react-spring";

import { useMetStore } from "./Store";

import "./App.css";

const ItemsGrid = lazy(() => import("./components/ItemsGrid"));

function App() {
  const [scrolled, setScrolled] = useState(false);

  const keyword = useMetStore((state) => state.keyword);
  const total = useMetStore((state) => state.total);
  const objectIDs = useMetStore((state) => state.objectIDs);
  const isLoading = useMetStore((state) => state.isLoading);
  const setKeyword = useMetStore((state) => state.setKeyword);
  const fetchResult = useMetStore((state) => state.fetchResult);

  const handleScroll = () => {
    if (window.pageYOffset < 10) setScrolled(false);
    else if (window.pageYOffset > 150) setScrolled(true);
  };

  const [timeoutToken, setTimeoutToken] = useState(null); //todo useRef

  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = (keyword) => {
    clearTimeout(timeoutToken);
    var token = setTimeout(() => setKeyword(keyword), 400);
    setTimeoutToken(token);
  };

  const chunk = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  };

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion, // disable all spring animations if user prefers reduced motions
    });

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries

    if (keyword) fetchResult();

    return function cleanup() {
      abortController.abort();
    };
  }, [fetchResult, keyword]);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const titleAnimateProps = useSpring({
    from: { width: "0vw" },
    width: "100vw",
    // config: { duration: 800 },
    marginTop: scrolled ? "-2em" : "0.67em",
  });

  return (
    <animated.div style={fadeInProps} className="app">
      <animated.div className="header">
        <animated.h1 style={titleAnimateProps}>
          🏛 Metropolitan Museum of Art
        </animated.h1>
        <input
          type="search"
          placeholder="Enter keyword here..."
          onChange={(e) => setKeywordDebounced(e.target.value)}
          aria-label="search term"
          // value={keyword}
        />
      </animated.div>
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
              total={total}
              keyword={keyword}
            />
            <div>
              {
                // break the results into chuncks of 200 items so that we can optimize performance by assigning
                // intersection observer to items in each chunk based on current scroll position at any given time
                objectIDs &&
                  chunk(objectIDs, 200).map((ids) => (
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
