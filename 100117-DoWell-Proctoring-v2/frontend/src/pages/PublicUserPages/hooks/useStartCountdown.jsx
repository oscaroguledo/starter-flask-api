import { useEffect } from "react";
import { addHoursToDate } from "../../../utils/utils";

const dummyDate = addHoursToDate(new Date(), 10);


export default function useStartCountDown(
    eventStarted,
    userDetails,
    currentEventDetail,
    iframeLoading,
    initialCountDownBegun,
    setInitialCountDownBegun,
    updateCountdownTimer,
) {
    useEffect(() => {
        if (!eventStarted || !userDetails.time_started || !currentEventDetail || iframeLoading || initialCountDownBegun) return;

        setInitialCountDownBegun(true);

        const countdown = setInterval(function() {

            // Get today's date and time
            const now = new Date().getTime();
                
            // Find the difference between now and the count down date
            // const countdownDate = addHoursToDate(new Date(userDetails?.time_started), currentEventDetail?.duration_in_hours);
            const countdownDate = addHoursToDate(dummyDate, currentEventDetail?.duration_in_hours);

            const distance = countdownDate.getTime() - now;
                
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            updateCountdownTimer({
                days,
                hours,
                minutes,
                seconds,
            })
                
            // If the count down is over
            if (distance < 0) {
                clearInterval(countdown);
            }
        }, 1000);

    }, [eventStarted, userDetails, currentEventDetail, initialCountDownBegun, iframeLoading])
}