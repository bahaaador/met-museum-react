import React, { useEffect, useState, useCallback } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useArtStore } from "@store/useArtStore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "./DetailsModal.css";

const DetailsModal = () => {
  const detailsModalData = useArtStore((state) => state.detailsModalData);
  const setDetailsModalOpen = useArtStore((state) => state.setDetailsModalOpen);

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

  const onClose = useCallback(() => {
    // first set the local state to false for the aimation to go through and then close the modal after 250 ms
    setIsOpen(false);
    setTimeout(() => setDetailsModalOpen(false), 250);
  }, [setDetailsModalOpen]);

  useEffect(() => {
    document.body.style.overflowY = "hidden"; // disable main screen's scroll

    return () => {
      document.body.style.overflowY = "unset"; // re-enable before unmounting
      document.body.style.overflowX = "hidden";
    };
  }, []);

  // Images
  const transformImageUrl = (url) => {
    return url.replace("/original/", "/web-large/");
  };

  const hasAdditionalImages = detailsModalData?.additionalImages?.length > 0;
  const totalImages = hasAdditionalImages
    ? detailsModalData.additionalImages.length + 1
    : 1;

  const nextImage = useCallback(() => {
    if (currentImageIndex < totalImages - 1)
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
  }, [currentImageIndex, totalImages]);

  const prevImage = useCallback(() => {
    if (currentImageIndex > 0)
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
  }, [currentImageIndex]);

  const getAllImages = () => {
    const additionalImages =
      detailsModalData.additionalImages?.map(transformImageUrl) || [];

    return [detailsModalData.primaryImageSmall, ...additionalImages].filter(
      (image) => image 
    );
  };

  // event handlers
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && hasAdditionalImages) {
        nextImage();
      } else if (e.key === "ArrowLeft" && hasAdditionalImages) {
        prevImage();
      }
    },
    [hasAdditionalImages, nextImage, onClose, prevImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown); //cleanup
    };
  }, [handleKeyDown]);

  return (
    detailsModalData && (
      <animated.div
        className="modal-overlay"
        onClick={onClose}
        style={fadeInProps}
      >
        <animated.div
          className="modal-content"
          style={slideInProps}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="carousel-wrapper">
            <div
              className="carousel"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {getAllImages().map((src, index) => (
                <img
                  key={index}
                  alt={`${detailsModalData.objectName} - Image ${index + 1}`}
                  src={src}
                />
              ))}
            </div>
            {hasAdditionalImages && (
              <>
                {currentImageIndex > 0 && (
                  <button className="nav-button left" onClick={prevImage}>
                    <FaChevronLeft />
                  </button>
                )}
                {currentImageIndex < totalImages - 1 && (
                  <button className="nav-button right" onClick={nextImage}>
                    <FaChevronRight />
                  </button>
                )}
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
          {/* <div className="item-row">
            <label>Dimensions:</label>
            <div>{detailsModalData.dimensions}</div>
          </div> */}
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
