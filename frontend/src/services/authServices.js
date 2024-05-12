import { clientAdminAxiosInstance, loginAxiosInstance } from "./config"

export const getUserInfoFromLogin = async (sessionId) => {
    return await loginAxiosInstance.post('userinfo/', { session_id: sessionId })
}

export const getUserInfoFromClientAdmin = async (sessionId) => {
    return await clientAdminAxiosInstance.post('userinfo/', { session_id: sessionId })
}