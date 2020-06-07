import React, { useEffect, useState } from "react";
import MusuemObjectListComponent from "./components/MusuemObjectListComponent";
import "./App.css";
import { useSpring, animated } from 'react-spring'
import { ReactComponent as Loading } from './loading.svg';
function App() {
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [museObjects, setMuseObjects] = useState(null);
  const [timeoutToken, setTimeoutToken] = useState(null);

  const props = useSpring({ opacity: 1, from: { opacity: 0 } })
  const h1Props = useSpring({ width: 450, config: { duration: 1000 }, from: { width: 0 } })
  /**
   * creates a "buffer" when user is typing a keyword to prevent multiple calls
   * @param {*} keyword
   */
  const setKeywordDebounced = keyword => {
    clearTimeout(timeoutToken);
    var token = setTimeout(() => setKeyword(keyword), 400);
    setTimeoutToken(token);
  };

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries, it seemed to be working as expected in chrome but looks like there might be a bug in firefox causing an exception to be thrown

    const fetchData = async () => {
      setIsLoading(true);

      if (!keyword) {
        setMuseObjects(null);
        setIsLoading(false);
      } else
        try {
          var res = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`,
            {
              method: "GET",
              signal: abortController.signal
            }
          );

          var response = await res.json();

          if (!response.objectIDs) setMuseObjects([]);
          else {
            var objects = await Promise.all(
              response.objectIDs
                .slice(0, 20) // take the first 20 items from results
                .map(async objectID => {
                  var res = await fetch(
                    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
                    { cache: "force-cache", signal: abortController.signal } //quick and inexpensive way to force browser to cache these subsequent calls since these will most likely be static result
                  );
                  var response = await res.json();
                  return response;
                })
            );
            setMuseObjects(objects);
          }
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

  return (
    <div style={props} className="App">
      <animated.h1 style={h1Props}>🖼 Metropolitan Museum of Art</animated.h1>
      <input
        type="text"
        placeholder="Enter keyword here..."
        onChange={e => setKeywordDebounced(e.target.value)}
        ref={input => input && input.focus()}
      ></input>
      {isLoading ? (
        <Loading style={{ height: '200px' }} />
      ) : (
          museObjects != null && <MusuemObjectListComponent items={museObjects} />
        )}
    </div>
  );
}

export default App;