import React, { useEffect, useState } from 'react'

import { useInView } from 'react-intersection-observer'

const LazyLoadedObjectComponent = ({ id, setDetailOverlay,...rest }) => {
    const [ref, inView] = useInView({
        rootMargin: '200px 0px',
    })
    const [item, setItem] = useState(null);
  
    
    useEffect(() => {
        const abortController = new AbortController(); // this is used to cancel ongoing fetch requests when user updates the keyword to make sure we only run relavant queries, it seemed to be working as expected in chrome but looks like there might be a bug in firefox causing an exception to be thrown

        const fetchData = async () => {
            console.info('downloading details for object id:' + id);

            try {
                var res = await fetch(
                    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
                    { cache: "force-cache", signal: abortController.signal } //quick and inexpensive way to force browser to cache these subsequent calls since these will most likely be static result
                );
                var response = await res.json();

                setItem(response);

            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("Fetch aborted 👀x2");
                    console.dir(err);
                } else {
                    console.error("Error occured", err);
                }
            }
        };

        if (inView)
            fetchData();

        return function cleanup() {
            abortController.abort();
        };
    }, [id, inView]);



    return (
        <div ref={ref} {...rest}>
            {inView && item ? <div
                key={item.objectID}
                onClick={() => {
                    setDetailOverlay(item);
                }}
            >
                <img alt={item.objectName} src={item.primaryImageSmall} />
                <span>
                    {item.title}
                    <a target="_new" href={item.objectURL}>
                        Link
                </a>
                </span>
                
            </div> : null}
        </div>
    )

}

export default LazyLoadedObjectComponent