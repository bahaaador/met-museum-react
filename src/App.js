import React, { useEffect, useState } from "react";
import LazyLoadedObjectListComponent from "./components/LazyLoadedObjectListComponent";

import "./App.css";
import { useSpring, animated } from 'react-spring'
import { ReactComponent as Loading } from './loading.svg';

const defaultSearchResult = { total: 0, objectIDs: [] };

function App() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(defaultSearchResult);
  const [timeoutToken, setTimeoutToken] = useState(null);

  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = keyword => {
    clearTimeout(timeoutToken);
    var token = setTimeout(() => setKeyword(keyword), 400);
    setTimeoutToken(token);
  };

  const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries, it seemed to be working as expected in chrome but looks like there might be a bug in firefox causing an exception to be thrown

    const fetchData = async () => {
      setIsLoading(true);

      if (!keyword) {
        setSearchResult(defaultSearchResult);
        setIsLoading(false);
      } else
        try {
          var res = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`,
            {
              method: "GET",
              signal: abortController.signal,
              cache: "force-cache",
            }
          );

          var response = await res.json();

          if (!response.objectIDs)
            setSearchResult(defaultSearchResult);
          else
            setSearchResult(response);

          setIsLoading(false);
        } catch (err) {
          if (err.name === "AbortError") {
            console.log("Fetch aborted 👀");
            console.dir(err);
          } else {
            console.error("Error occured", err);
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
      <animated.h1 style={titleAnimateProps}>🖼 Metropolitan Museum of Art</animated.h1>
      <input
        type="text"
        placeholder="Enter keyword here..."
        onChange={e => setKeywordDebounced(e.target.value)}
        ref={input => input && input.focus()}
      />
      {isLoading ? (
        <Loading style={{ height: '200px' }} />
      ) : (
          <>
            <ResultsCaption style={fadeInProps} total={searchResult.total} keyword={keyword} />
            <div >
              {chunk(searchResult.objectIDs, 200).map(ids =>
                <LazyLoadedObjectListComponent key={ids[0]} data={ids}  />
              )}
            </div>
          </>
        )}
    </animated.div>
  );
}

const ResultsCaption = ({ total, keyword, ...props }) => keyword ?
  <animated.span className="Search-Caption" {...props}>{total + ` results for: ` + keyword}</animated.span> : null;

export default App;