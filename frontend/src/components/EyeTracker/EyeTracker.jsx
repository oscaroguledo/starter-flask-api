import { useEffect, useRef, useState } from "react"

export default function EyeTracker () {
    const trackRef = useRef();
    const [ divClicked, setDivClicked ] = useState(false);

    useEffect(() => {
        const webgazer = window.webgazer;

        webgazer.setGazeListener((data, clock) => {
            // send the data
            // console.log(data, clock);
        }).begin();

        if (divClicked) return;

        setTimeout(() => {

            trackRef.current?.click();
            setDivClicked(true);
    
        }, 2500);

    }, [])

    return <>
        <div ref={trackRef}></div>
    </>
}