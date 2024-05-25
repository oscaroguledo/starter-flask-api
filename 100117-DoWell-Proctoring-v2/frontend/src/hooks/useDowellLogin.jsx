import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getSavedUserFromSessionStorage } from "../utils/utils";
import { DOWELL_LOGIN_URL, USER_DETAIL_KEY_IN_SESSION, USER_ID_KEY_IN_SESSION, USER_SESSION_KEY_IN_SESSION } from "../utils/constants";
import { useUserContext } from "../contexts";
import { getUserInfoFromClientAdmin, getUserInfoFromLogin } from "../services/authServices";

export default function useDowellLogin () {
    const {
        setCurrentUser,
        setUserDetailLoading,
        setIsPublicUser,
    } = useUserContext();

    const [ searchParams, setSearchParams ] = useSearchParams();
    
    const sessionId = searchParams.get('session_id');
    const id = searchParams.get('id');
    const currentView = searchParams.get('view');

    const currentLocalUser = getSavedUserFromSessionStorage();

    useEffect(() => {
        if (currentView === 'public') {
            setIsPublicUser(true);
            setUserDetailLoading(false);
            return
        }

        if (!sessionId && !currentLocalUser) {
            window.location.replace(DOWELL_LOGIN_URL);
            return
        }

        if (currentLocalUser) {
            setCurrentUser(currentLocalUser);
            setUserDetailLoading(false);
            return
        }

        if (id) {
            getUserInfoFromClientAdmin(sessionId).then(res => {
                setUserDetailLoading(false);
                
                if (typeof res.data === 'object') {
                    setCurrentUser(res.data);

                    sessionStorage.setItem(USER_DETAIL_KEY_IN_SESSION, JSON.stringify(res.data));
                    sessionStorage.setItem(USER_SESSION_KEY_IN_SESSION, sessionId);
                    sessionStorage.setItem(USER_ID_KEY_IN_SESSION, id);
                }
            }).catch(err => {
                console.log(err?.response?.data);
                setUserDetailLoading(false);
            }) 

            return
        }

        getUserInfoFromLogin(sessionId).then(res => {
            setUserDetailLoading(false);

            if (typeof res.data === 'object') {
                setCurrentUser(res.data);

                sessionStorage.setItem(USER_DETAIL_KEY_IN_SESSION, JSON.stringify(res.data));
                sessionStorage.setItem(USER_SESSION_KEY_IN_SESSION, sessionId);
            }
        }).catch(err => {
            console.log(err?.response?.data);
            setUserDetailLoading(false);
        })
        
    }, [])
}