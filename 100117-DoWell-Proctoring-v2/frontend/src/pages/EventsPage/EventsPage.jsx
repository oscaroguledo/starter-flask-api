/* eslint-disable no-unused-vars */
import React from "react";
import styles from "./styles.module.css";
import { useEventsContext } from "../../contexts/index";
import { formatDate } from "../../helpers/formatDate";
import EventCard from "./EventCard/EventCard";
import { allEventsData } from "../../services/eventsDataServices";

const EventsPage = () => {
  const { allEvents } = useEventsContext();

  // console.log(allEventsData);
  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>My Events</h1>
      <div className={styles.main__content}>
        {allEvents.map((event) => (
          <EventCard
            key={event._id}
            eventName={event.name}
            startTime={formatDate(event.start_time)}
            endTime={formatDate(event.close_date)}
            participants={event.participants}
          />
        ))}
      </div>
    </section>
  );
};

export default EventsPage;
