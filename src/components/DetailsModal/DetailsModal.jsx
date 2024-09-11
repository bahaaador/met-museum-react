import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useMetStore } from "@store";

import "./DetailsModal.css";

const DetailsModal = () => {
  const setDetailsModalOpen = useMetStore((state) => state.setDetailsModalOpen);
  const data = useMetStore((state) => state.detailsModalData);

  const [isOpen, setIsOpen] = useState(true); // local state is used for animations only

  const slideInProps = useSpring({
    top: isOpen ? "50%" : "150%",
    config: { tension: 480, friction: 60 },
    from: { top: "150%" },
  });

  const fadeInProps = useSpring({
    opacity: isOpen ? 1 : 0,
    from: { opacity: 0 },
  });

  const onClose = () => {
    // first set the local state to false for the aimation to go through and then close the modal after 250 ms
    setIsOpen(false);
    setTimeout(() => setDetailsModalOpen(false), 250);
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden"; // disable main screen's scroll

    return () => {
      document.body.style.overflowY = "unset"; // re-enable before unmounting
      document.body.style.overflowX = "hidden";
    };
  }, []);

  return (
    data && (
      <animated.div
        className="modal-overlay"
        onClick={onClose}
        style={fadeInProps}
      >
        <animated.div className="modal-content" style={slideInProps}>
          <div className="image-wrapper">
            <img alt={data.objectName} src={data.primaryImageSmall} />
          </div>
          <div className="item-row">
            <label>Title:</label>
            <div>{data.title}</div>
          </div>
          {
            // added a null check for the ones I noticed are sometimes returned as null from the server, for a better user experience :)
            data.artistDisplayName && (
              <div className="item-row">
                <label>Artist:</label>
                <div>{data.artistDisplayName}</div>
              </div>
            )
          }
          {data.classification && (
            <div className="item-row">
              <label>Classification:</label>
              <div>{data.classification}</div>
            </div>
          )}
          <div className="item-row">
            <label>Dimensions:</label>
            <div>{data.dimensions}</div>
          </div>
          <div className="item-row">
            <label>Date:</label>
            <div>{data.objectDate}</div>
          </div>
          {data.period && (
            <div className="item-row">
              <label>Period:</label>
              <div>{data.period}</div>
            </div>
          )}
          <div className="item-row">
            <label>Credit line:</label>
            <div>{data.creditLine}</div>
          </div>
        </animated.div>
      </animated.div>
    )
  );
};

export default DetailsModal;
