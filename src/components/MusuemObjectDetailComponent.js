import React from "react";
import "./MusuemObjectDetailComponent.css";

const MusuemObjectDetailComponent = props => {
  const { item, closeModal } = props;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content">
        <img alt={item.objectName} src={item.primaryImageSmall} />
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
      </div>
    </div>
  );
};

export default MusuemObjectDetailComponent;
