import { useEffect } from "react";
import { updateParticipantDetailForEvent } from "../../../services/participantServices";
import { getSavedPublicUserFromLocalStorage } from "../../../utils/utils";
import { PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE } from "../../../utils/constants";

export default function useUpdateEventStartTime(
    iframeLoading,
    eventStarted,
    foundEventDetail,
    userDetails,
    updateUserDetails,
) {    
    useEffect(() => {
        if (iframeLoading || !eventStarted || !foundEventDetail || userDetails.time_started || !userDetails._id) return;

        const dataToPost = {
            event_id: foundEventDetail._id,
            participant_id: userDetails._id,
        };

        updateParticipantDetailForEvent('time-started', dataToPost).then(res => {
            const allSavedEventDetailsForUser = getSavedPublicUserFromLocalStorage();
                
            const updatedEventsForUser = allSavedEventDetailsForUser && Array.isArray(allSavedEventDetailsForUser) ? 
                allSavedEventDetailsForUser 
            : 
            [];
            
            const updatedParticipantDetail = res.data?.data;
            updateUserDetails({...userDetails, ...updatedParticipantDetail});

            const savedPreviousDetailsInStorageIndex = allSavedEventDetailsForUser.findIndex(event => event.event_id === foundEventDetail._id);
            if (savedPreviousDetailsInStorageIndex !== -1) {
                const savedPreviousUserDetailsInStorage = allSavedEventDetailsForUser[savedPreviousDetailsInStorageIndex];
                allSavedEventDetailsForUser[savedPreviousDetailsInStorageIndex] = { ...savedPreviousUserDetailsInStorage, ...updatedParticipantDetail };

                localStorage.setItem(PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE, JSON.stringify(updatedEventsForUser));
            }
        }).catch(err => {
            console.log('Error updating start time for participant: ', err?.response?.data);
        })

    }, [iframeLoading, eventStarted, foundEventDetail, userDetails])
}