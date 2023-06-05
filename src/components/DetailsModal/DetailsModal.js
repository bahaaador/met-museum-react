import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import "./DetailsModal.css";

const DetailsModal = ({ item, closeModal }) => {
  const [isOpen, setIsOpen] = useState(true);

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
    setIsOpen(false);
    setTimeout(closeModal, 250);
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden"; // disable main screen's scroll
    return () => {
      document.body.style.overflowY = "unset";
      document.body.style.overflowX = "hidden";
    };
  }, []);

  return (
    item && (
      <animated.div
        className="modal-overlay"
        onClick={onClose}
        style={fadeInProps}
      >
        <animated.div className="modal-content" style={slideInProps}>
          <div className="image-wrapper">
            <img alt={item.objectName} src={item.primaryImageSmall} />
          </div>
          <div className="item-row">
            <label>Title:</label>
            <div>{item.title}</div>
          </div>
          {item.artistDisplayName && (
            <div className="item-row">
              <label>Artist:</label>
              <div>{item.artistDisplayName}</div>
            </div>
          )}
          <div className="item-row">
            <label>Classification:</label>
            <div>{item.classification}</div>
          </div>
          <div className="item-row">
            <label>Dimensions:</label>
            <div>{item.dimensions}</div>
          </div>
          <div className="item-row">
            <label>Date:</label>
            <div>{item.objectDate}</div>
          </div>
          {item.period && (
            <div className="item-row">
              <label>Period:</label>
              <div>{item.period}</div>
            </div>
          )}
          <div className="item-row">
            <label>Credit line:</label>
            <div>{item.creditLine}</div>
          </div>
        </animated.div>
      </animated.div>
    )
  );
};

export default DetailsModal;
