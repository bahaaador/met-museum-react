import React, { useEffect, lazy, Suspense } from "react";
import {
  useSpring,
  animated,
  Globals,
  useReducedMotion,
} from "@react-spring/web";

import { useArtStore, getArtState } from "@store/artStore";
import Header from "@components/Header";

import "./App.css";
import { chunkArray } from "@utils";

const ItemsGrid = lazy(() => import("@components/ItemsGrid"));
const DetailsModal = lazy(() => import("@components/DetailsModal"));

const data_chunk_size = 200;

function App() {
  const {
    objectIDs,
    isLoading,
    detailsModalOpen,
    error,
    reset,
  } = useArtStore();

  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    console.log("reset");
    reset(); // reset state on mount
  }, []);

  useEffect(() => {
    Globals.assign({
      skipAnimation: prefersReducedMotion, // disable all spring animations if user prefers reduced motions
    });

  }, [prefersReducedMotion]);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

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
