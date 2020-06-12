import React , {useState} from 'react'
import { useInView } from 'react-intersection-observer'
import LazyLoadedObjectComponent from "./LazyLoadedObjectComponent";
import DetailOverlay from "./MusuemObjectDetailComponent";
import "./LazyLoadedObjectListComponent.css";

const LazyLoadedObjectListComponent = ({ data, ...rest }) => {
    const [ref, inView] = useInView({
        rootMargin: '200px 0px',
    })
    const [detailOverlay, setDetailOverlay] = useState(null);
    return (
        <div ref={ref} style={{minHeight: !inView? '30000px':null}} className={"Search-Result-Grid"}>
            {inView && data.map(id => <LazyLoadedObjectComponent {...rest} setDetailOverlay={setDetailOverlay} className={"object-container"} id={id} key={id} />)}
            {
              detailOverlay && (
                <DetailOverlay
                  item={detailOverlay}
                  closeModal={() => setDetailOverlay(null)}
                />)
            }
        </div>
    )
}

export default LazyLoadedObjectListComponent