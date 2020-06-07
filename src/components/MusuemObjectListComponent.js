import React, { useState } from "react";
import "./MusuemObjectListComponent.css";
import DetailOverlay from "./MusuemObjectDetailComponent";
import { useTrail , animated} from 'react-spring';
const MusuemObjectListComponent = props => {
  const { items } = props;

  const [showDetailOverlay, setShowDetailOverlay] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const trail = useTrail(items.length, {
    from: {  opacity: 0, transform: 'translate3d(0,-20px,0)' },
    to: {  opacity: 1, transform: 'translate3d(0,0px,0)' }
  })

  return (
    <>
      <div className="result-container">
        {items && items.length === 0 ? (
          <h2>No result.</h2>
        ) : (
            trail.map((props, index) => {
              var item = items[index];
              return (
                <animated.div
                  key={item.objectID}
                  style={props}
                  onClick={() => {
                    setSelectedItemId(item.objectID);
                    setShowDetailOverlay(true);
                  }}
                >
                  <img alt={item.objectName} src={item.primaryImageSmall} />
                  <span>
                    {item.title}
                    <a target="_new" href={item.objectURL}>
                      Link
                </a>
                  </span>
                </animated.div>
              )
            }))}
      </div>
      {
        showDetailOverlay && (
          <DetailOverlay
            item={items.find(item => item.objectID === selectedItemId)}
            closeModal={() => setShowDetailOverlay(false)}
          />)
      }
    </>
  )
}
export default MusuemObjectListComponent;