import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import { useMetStore } from "@store";
import { fetchItemDetails } from "@api/metMusuem";

import "./ItemCard.css";

const ItemCard = ({ id }) => {
  const [ref, inView] = useInView({
    rootMargin: "200px 0px",
  });

  const setDetailsModalData = useMetStore((state) => state.setDetailsModalData);

  const [item, setItem] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const fadeInPropsImage = useSpring({
    opacity: imageLoaded ? 1 : 0,
  });

  const [{ transform, color, opacity }, setAnimatedProps] = useSpring(() => ({
    transform: "scale(1)",
    color: "#000",
    opacity: "0.7",
    marginTop: 0,
  }));

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we don't wait for expired requests to go through

    const fetchData = async () => {
      console.info("fetching details for object id:" + id);

      try {
        const data = await fetchItemDetails(id, abortController.signal);
        setItem(data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch details aborted 👀");
          console.dir(err);
        } else {
          console.error(`Error fetching item id:${id}`, err);
        }
      }
    };

    if (inView) fetchData(); // fetch data as soon as the item is -close to be- visibile

    return function cleanup() {
      abortController.abort();
    };
  }, [id, inView]);

  const renderCardContent = () => {
    if (!inView) return null;

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
        <animated.span style={{ color, opacity }}>{item.title}</animated.span>
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
          color: "#fff",
          opacity: "1",
          transform: "scale(1.06)",
        })
      }
      onMouseLeave={() =>
        setAnimatedProps({
          color: "#000",
          opacity: "0.7",
          transform: "scale(1)",
        })
      }
    >
      {renderCardContent()}
    </animated.div>
  );
};

const Shimmer = () => (
  <div className="shimmer" aria-label="Loading content">
    <div className="image" />
    <div className="content">
      <span className="title" />
    </div>
  </div>
);

export default ItemCard;
