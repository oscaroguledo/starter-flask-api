import { useContext } from "react";
import { UserContext } from "./UserContext";
import { EventsContext } from "./EventsContext";

export const useUserContext = () => useContext(UserContext);
export const useEventsContext = () => useContext(EventsContext);
