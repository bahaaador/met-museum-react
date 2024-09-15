import React from "react";
import { useInView } from "react-intersection-observer";

import "./ItemsGrid.css";

import ArtifactComponent from "../ArtifactComponent";
const ArtifactComponentMemoized = React.memo(ArtifactComponent);

const ItemsGrid = ({ data }) => {
  const [ref, inView] = useInView({
    rootMargin: "200px 0px",
  });

  return (
    <div
      ref={ref}
      style={{ minHeight: !inView ? "30000px" : null }}
      className={"search-result-grid"}
    >
      {inView && data.map((id) => <ArtifactComponentMemoized id={id} key={id} />)}
    </div>
  );
};

export default ItemsGrid;
