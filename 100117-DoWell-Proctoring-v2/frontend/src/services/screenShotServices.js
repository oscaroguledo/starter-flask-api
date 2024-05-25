import { defaultAxiosInstance } from "./config";
import { screenshotRoutePrefix } from "./routeUtils";

export const captureScreenshot = async (data) => {
  return await defaultAxiosInstance.post(`${screenshotRoutePrefix}/add`, data);
};
