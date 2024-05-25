import { defaultAxiosInstance } from "./config";
import { participantRoutePrefix } from "./routeUtils";

export const registerForEvent = async (data) => {
    return await defaultAxiosInstance.post(`${participantRoutePrefix}/add`, data);
}

export const updateParticipantDetailForEvent = async (updateType, data) => {
    return await defaultAxiosInstance.patch(`${participantRoutePrefix}/update/${updateType}`, data);
}

export const getPartcipantData = async (email, eventId) => {
    return await defaultAxiosInstance.get(`${participantRoutePrefix}/get?email=${email}&event_id=${eventId}`);
}

export const faceCompare = async (data) => {
    return await defaultAxiosInstance.post(`facecompare`,data);
}