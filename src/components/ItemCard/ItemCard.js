import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from "react-intersection-observer";
import "./ItemCard.css";

const ItemCard = ({ id, setDetailOverlay, ...rest }) => {
  const [ref, inView] = useInView({
    rootMargin: "200px 0px",
  });

  const [item, setItem] = useState(null);

  useEffect(() => {
    const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries

    const fetchData = async () => {
      console.info("fetching details for object id:" + id);

      try {
        var res = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
          { cache: "force-cache", signal: abortController.signal } // quick and inexpensive way to force browser to cache these subsequent calls since these will most likely be static result
        );

        var response = await res.json();
        setItem(response);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch details aborted 👀");
          console.dir(err);
        } else {
          console.error(`Error fetching item id:${id}`, err);
        }
      }
    };

    if (inView) fetchData();

    return function cleanup() {
      abortController.abort();
    };
  }, [id, inView]);

  const fadeInProps = useSpring({ opacity: 1, from: { opacity: 0 } });

  const [{ transform, color, opacity }, setAnimatedProps] = useSpring(() => ({
    transform: "scale(1)",
    color: "#000",
    opacity: "0.7",
    marginTop: 0,
  }));

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
      {inView && item ? (
        <animated.div
          key={item.objectID}
          onClick={() => {
            setDetailOverlay(item);
          }}
        >
          {item.primaryImageSmall && (
            <img alt={item.objectName} src={item.primaryImageSmall} />
          )}
          <animated.span style={{ color, opacity }}>
            {item.title}
            {/* <a
              target="_new"
              href={item.objectURL}
              aria-label={`View ${item.objectName} on museum's website`}
            >
              Link
            </a> */}
          </animated.span>
        </animated.div>
      ) : null}
    </animated.div>
  );
};

export default ItemCard;
