import React, { useEffect, lazy, Suspense } from "react";
import { useSpring, animated, Globals, useReducedMotion } from "react-spring";

import { useMetStore } from "./Store";
import Header from "components/Header/Header";
import "./App.css";

const ItemsGrid = lazy(() => import("./components/ItemsGrid"));
const DetailsModal = lazy(() => import("components/DetailsModal/DetailsModal"));

function App() {
  const objectIDs = useMetStore((state) => state.objectIDs);
  const isLoading = useMetStore((state) => state.isLoading);
  const detailsModalOpen = useMetStore((state) => state.detailsModalOpen);

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

    // on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  return (
    <animated.div style={fadeInProps} className="app">
      <Header />
      <Suspense fallback={<LoadingIndicator />}>
        {
          // display loading indicator when loading components, also when fetching data from api
        }
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            {
              // break the results into chuncks of 200 items so that we can optimize performance by assigning
              // intersection observer to items in each chunk based on current scroll position at any given time
              objectIDs &&
                chunk(objectIDs, 200).map((ids) => (
                  <ItemsGrid key={ids[0]} data={ids} />
                ))
            }
          </>
        )}
      </Suspense>
      <Suspense>{detailsModalOpen && <DetailsModal />}</Suspense>
    </animated.div>
  );
}

const LoadingIndicator = () => <div className="loading"></div>;

export default App;
