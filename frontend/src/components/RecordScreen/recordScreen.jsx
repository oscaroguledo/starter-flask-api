/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const RecordView = ({ canStartRecording, stopRecording, children }) => {
  const videoRef = useRef(null);

  const {
    status,
    startRecording,
    stopRecording: stop,
  } = useReactMediaRecorder({
    screen: true,
    onStop: (blobUrl) => {
      if (stopRecording) stopRecording(blobUrl);
      console.log("onStop", blobUrl);
    },
  });

  useEffect(() => {
    if (!videoRef.current) return;
    if (canStartRecording && status === "idle") {
      startRecording();
    }
    if (stopRecording && stopRecording === true) {
      stop();
    }
  }, [canStartRecording, stopRecording, status, stop, startRecording]);

  return (
    <div>
      {children}
      <video ref={videoRef} autoPlay />
    </div>
  );
};

export default RecordView;
