import { defaultAxiosInstance } from "./config";
import { eventRoutePrefix } from "./routeUtils";
import { messageRoutePrefix } from "./routeUtils";

export const getEventById = async (eventId) => {
  return await defaultAxiosInstance.get(`${eventRoutePrefix}/${eventId}`);
};

export const addNewEvent = async (data) => {
  return await defaultAxiosInstance.post(`${eventRoutePrefix}/new`, data);
};

export const getAllEvents = async (userId) => {
  return await defaultAxiosInstance.get(
    `${eventRoutePrefix}/all?user_id=${userId}`
  );
};
export const getMessages = async (data) => {
  return await defaultAxiosInstance.post(`${messageRoutePrefix}/get`, data);
};
