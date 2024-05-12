import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getEventById } from "../../../services/eventServices";
import { getSavedPublicUserFromLocalStorage } from "../../../utils/utils";

export default function useLoadEventDetail(
    foundEventDetail,
    updateFoundEventDetail,
    updateFormPage,
    updateEventDetailLoading,
    updateEventStarted,
    updateUserDetails,
    callFunctionsToRequestPermissions = async () => {},
) {
    const [ searchParams, setSearchParams ] = useSearchParams();
    
    useEffect(() => {
        const eventId = searchParams.get('event_id');
        if (foundEventDetail || !eventId) return updateEventDetailLoading(false);

        const allSavedEventDetailsForUser = getSavedPublicUserFromLocalStorage();
        const savedPreviousUserDetails = allSavedEventDetailsForUser && Array.isArray(allSavedEventDetailsForUser) ? 
            allSavedEventDetailsForUser.find(event => event.event_id === eventId)
        :
        null;

        getEventById(eventId).then(async (res) => {
            const fetchedEvent = res?.data?.data;

            updateEventDetailLoading(false);

            if (typeof fetchedEvent === 'object') {
                updateFoundEventDetail(fetchedEvent);

                if (
                    (new Date().getTime() < new Date(fetchedEvent?.close_date).getTime()) &&
                    savedPreviousUserDetails
                ) {
                    updateFormPage(4);
                    

                    await callFunctionsToRequestPermissions();
                    
                    updateEventStarted(true);
                    updateUserDetails(savedPreviousUserDetails);
                }
            }
        }).catch(err => {
            console.log(err?.response?.data);
            updateEventDetailLoading(false);
        })
    }, [])
}