import React from "react";
import { useSpring, animated } from 'react-spring'
import "./MusuemObjectDetailComponent.css";

const MusuemObjectDetailComponent = props => {
  const { item, closeModal } = props;

  const slideInProps = useSpring({ maxHeight: '100vh', opacity: 1, from: { opacity: 0, maxHeight: '0vh' } })

  return (
    <animated.div className="modal-overlay" onClick={closeModal}  >
      <animated.div className="modal-content" style={slideInProps}>
        <div className="image-wrapper">
          <img alt={item.objectName} src={item.primaryImageSmall} /></div>
        <label>Title:</label>
        {item.title}
        <br />

        <label>Artist:</label>
        {item.artistDisplayName}
        <br />

        <label>Classification:</label>
        {item.classification}
        <br />

        <label>Dimensions:</label>
        {item.dimensions}
        <br />

        <label>Date:</label>
        {item.objectDate}
      </animated.div>
    </animated.div>
  );
};

export default MusuemObjectDetailComponent;
