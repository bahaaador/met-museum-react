import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { useArtStore } from "@store/artStore";
import Shimmer from "./Shimmer";

import "./ArtifactComponent.css";

const ArtifactComponent = ({ id }) => {
  const [ref, inView] = useInView({
    rootMargin: "200px 0px",
  });

  const { setDetailsModalData, getArtifactDetails } = useArtStore();
  const [item, setItem] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const fadeInPropsImage = useSpring({
    opacity: imageLoaded ? 1 : 0,
  });

  const [{ transform, opacity }, setAnimatedProps] = useSpring(
    () => ({
      transform: "scale(1)",
      opacity: "0.7",
      marginTop: 0,
    })
  );

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we don't wait for expired requests to go through
    const getItem = async () => {
      const item = await getArtifactDetails(id, abortController.signal); // fetch data as soon as the item is -close to be- visibile
      setItem(item);
    };

    if (inView) getItem();

    return function cleanup() {
      abortController.abort();
    };
  }, [id, inView]);

  const renderCardContent = () => {
    if (!inView) if (!inView) return null;

    if (item == null) return <Shimmer />;

    return (
      <animated.div
        key={item.objectID}
        onClick={() => {
          setDetailsModalData(item);
        }}
      >
        {item.primaryImageSmall && (
          <animated.img
            style={fadeInPropsImage}
            hidden={true}
            alt={item.objectName}
            src={item.primaryImageSmall}
            onLoad={handleImageLoaded}
          />
        )}
        <animated.div className="artifact-info" style={{ opacity }}>
          <h3 className="artifact-title">{item.title}</h3>
          <p className="artifact-subtitle">{item.department}</p>
        </animated.div>
      </animated.div>
    );
  };

  return (
    <animated.div
      style={{ ...fadeInProps, transform }}
      className={"card"}
      ref={ref}
      onMouseOver={() =>
        setAnimatedProps({
          opacity: "1",
          transform: "scale(1.06)",
        })
      }
      onMouseLeave={() =>
        setAnimatedProps({
          opacity: "0.7",
          transform: "scale(1)",
        })
      }
    >
      {renderCardContent()}
    </animated.div>
  );
};

export default ArtifactComponent;
