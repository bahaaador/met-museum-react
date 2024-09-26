import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useArtStore } from "@store/artStore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "./DetailsModal.css";

const DetailsModal = () => {
  const { detailsModalData, setDetailsModalOpen } = useArtStore();
  const [isOpen, setIsOpen] = useState(true); // local state is used for animations only
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      console.log("escape")
      onClose();
    }

    if (e.key === "ArrowRight" && hasAdditionalImages) {
      nextImage();
    }

    if (e.key === "ArrowLeft" && hasAdditionalImages) {
      prevImage();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown); //cleanup
    };
  }, []);

  useEffect(() => {
    document.body.style.overflowY = "hidden"; // disable main screen's scroll

    return () => {
      document.body.style.overflowY = "unset"; // re-enable before unmounting
      document.body.style.overflowX = "hidden";
    };
  }, []);


  const hasAdditionalImages = detailsModalData?.additionalImages?.length > 0;
  const totalImages = hasAdditionalImages ? detailsModalData.additionalImages.length + 1 : 1;


  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => (prevIndex + direction + totalImages) % totalImages);
  };

  const nextImage = () => changeImage(1);
  const prevImage = () => changeImage(-1);

  const getCurrentImage = () => {
    if (currentImageIndex === 0) return detailsModalData.primaryImageSmall;
    return detailsModalData.additionalImages[currentImageIndex - 1];
  };

  return (
    detailsModalData && (
      <animated.div
        className="modal-overlay"
        onClick={onClose}
        style={fadeInProps}
      >
        <animated.div className="modal-content" style={slideInProps}>
          <div className="image-wrapper" onClick={(e) => e.stopPropagation()}>
            <img alt={detailsModalData.objectName} src={getCurrentImage()} />
            {hasAdditionalImages && (
              <>
                <button className="nav-button left" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <button className="nav-button right" onClick={nextImage}>
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
          <div className="item-row">
            <label>Title:</label>
            <div>{detailsModalData.title}</div>
          </div>
          {
            // added a null check for the ones I noticed are sometimes returned as null from the server, for a better user experience :)
            detailsModalData.artistDisplayName && (
              <div className="item-row">
                <label>Artist:</label>
                <div>{detailsModalData.artistDisplayName}</div>
              </div>
            )
          }
          {detailsModalData.classification && (
            <div className="item-row">
              <label>Classification:</label>
              <div>{detailsModalData.classification}</div>
            </div>
          )}
          <div className="item-row">
            <label>Dimensions:</label>
            <div>{detailsModalData.dimensions}</div>
          </div>
          <div className="item-row">
            <label>Date:</label>
            <div>{detailsModalData.objectDate}</div>
          </div>
          {detailsModalData.period && (
            <div className="item-row">
              <label>Period:</label>
              <div>{detailsModalData.period}</div>
            </div>
          )}
          <div className="item-row">
            <label>Credit line:</label>
            <div>{detailsModalData.creditLine}</div>
          </div>
        </animated.div>
      </animated.div>
    )
  );
};

export default DetailsModal;
