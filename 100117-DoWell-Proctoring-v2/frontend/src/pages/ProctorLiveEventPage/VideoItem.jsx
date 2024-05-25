import { useEffect, useRef } from "react";

const VideoItem = ({ videoStream, isMuted }) => {

    const videoRef = useRef();

    useEffect(() => {
        
        if (!videoRef.current || !videoStream) return

        console.log(videoStream);
        console.log(typeof videoStream);

        videoRef.current.srcObject = videoStream;
        
    }, [videoStream])

    useEffect(() => {
        
        if (!videoStream) return

        videoStream.getAudioTracks().forEach(track => {
            track.enabled = isMuted ? true : false
        });

    }, [videoStream, isMuted])

    return <>
        <video 
            muted={isMuted ? true : false} 
            ref={videoRef} 
            autoPlay 
            playsInline 
            controls={false} 
            controlsList="nofullscreen"
        ></video>                
    </>
}

export default VideoItem;
