import React, { useEffect, lazy, Suspense, useMemo } from "react";
import {
  useSpring,
  animated,
  useTrail,
  useReducedMotion,
  Globals,
} from "@react-spring/web";
import { useArtStore } from "@store/useArtStore";
import Header from "@components/Header";
import "./App.css";
import { chunkArray } from "@utils";
import { exampleQueries } from "./exampleQueries";

const AnimatedSuggestionButton = ({ suggestion, onClick }) => {
  const [spring, api] = useSpring(() => ({
    from: { scale: 1 },
    config: { tension: 300, friction: 10 },
  }));

  const handleHover = () => {
    api.start({ scale: 1.05 });
  };

  const handleLeave = () => {
    api.start({ scale: 1 });
  };

  return (
    <animated.button
      style={spring}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      onClick={() => onClick(suggestion)}
    >
      {suggestion}
    </animated.button>
  );
};

const ItemsGrid = lazy(() => import("@components/ItemsGrid"));
const DetailsModal = lazy(() => import("@components/DetailsModal"));

const data_chunk_size = 200;

function App() {
  const objectIDs = useArtStore((state) => state.objectIDs);
  const isLoading = useArtStore((state) => state.isLoading);
  const detailsModalOpen = useArtStore((state) => state.detailsModalOpen);
  const error = useArtStore((state) => state.error);
  const reset = useArtStore((state) => state.reset);
  const keyword = useArtStore((state) => state.keyword);
  const setKeyword = useArtStore((state) => state.setKeyword);

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    reset(); // reset state when component first mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion, // disable all spring animations if user prefers reduced motions
    });
  }, [prefersReducedMotion]);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const randomExampleQueries = useMemo(() => {
    return exampleQueries.sort(() => 0.5 - Math.random()).slice(0, 8);
  }, []);

  const trail = useTrail(randomExampleQueries.length, {
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion);
  };

  const suggestionSectionFade = useSpring({
    opacity: keyword ? 0 : 1,
    config: { duration: 300 },
  });

  return (
    <animated.div style={fadeInProps} className="app">
      <Header />
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <Suspense fallback={<LoadingIndicator />}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {!keyword && (
              <div className="example-queries-container">
                <animated.div
                  className="example-queries"
                  style={suggestionSectionFade}
                >
                  <h2 className="example-queries-title">Try searching for:</h2>
                  <ul>
                    {trail.map((style, index) => (
                      <animated.li
                        key={randomExampleQueries[index]}
                        style={style}
                      >
                        <AnimatedSuggestionButton
                          suggestion={randomExampleQueries[index]}
                          onClick={handleSuggestionClick}
                        />
                      </animated.li>
                    ))}
                  </ul>
                </animated.div>
              </div>
            )}
            {objectIDs &&
              chunkArray(objectIDs, data_chunk_size).map((ids) => (
                <ItemsGrid key={ids[0]} data={ids} />
              ))}
          </>
        )}
      </Suspense>
      <Suspense>{detailsModalOpen && <DetailsModal />}</Suspense>
    </animated.div>
  );
}

const LoadingIndicator = () => <div className="loading"></div>;

export default App;
