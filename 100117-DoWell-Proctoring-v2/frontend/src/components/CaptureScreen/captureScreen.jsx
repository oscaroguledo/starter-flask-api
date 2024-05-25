/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { captureScreenshot } from "../../services/screenShotServices";

const ScreenCapture = ({ children, captureScreen, eventId, participantId }) => {
  const captureRef = useRef(null);

  useEffect(() => {
    if (!captureScreen || !eventId || !participantId) return;

    const handleCapture = () => {
      if (!captureRef.current) return;

      html2canvas(captureRef.current)
        .then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");

          try {
            const data = {
              event_id: eventId,
              participant_id: participantId,
              image: imgData,
            };
            await captureScreenshot(data);
          } catch (error) {
            console.error(error?.response?.data);
          }
        })
        .catch((error) => {
          console.error("Error while capturingg:", error);
        });
    };

    const interval = setInterval(() => handleCapture(), 60000);
    return () => {
      clearInterval(interval);
    };
  }, [captureScreen, eventId, participantId]);

  return (
    <>
      <div ref={captureRef}>{children}</div>
    </>
  );
};

export default ScreenCapture;
