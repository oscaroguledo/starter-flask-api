/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";
import { getAllEvents } from "../services/eventServices";

export const EventsContext = createContext({});

export default function EventsContextProvider({ children }) {
  const [allEvents, setAllEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const { eventsLoaded, setEventsLoaded } = useState(false);

  useEffect(() => {
    if (eventsLoaded) return;
    const getAllEventsData = async () => {
      setEventsLoading(true);
      try {
        const res = (await getAllEvents()).data;
        const data = res?.data;
        setAllEvents(data);
        setEventsLoading(false);
        setEventsLoaded(true);
      } catch (error) {
        console.log(error);
        setEventsLoading(false);
      }
    };

    getAllEventsData();
  }, [setAllEvents, setEventsLoading, setEventsLoaded, eventsLoaded]);

  return (
    <>
      <EventsContext.Provider
        value={{
          allEvents,
          setAllEvents,
          eventsLoading,
          setEventsLoading,
          eventsLoaded,
          setEventsLoaded,
        }}
      >
        {children}
      </EventsContext.Provider>
    </>
  );
}
