/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts";
import { IoAddCircleOutline } from "react-icons/io5";
import styles from "./styles.module.css";
import AddEventModal from "./EventModal/EventModal";
import RecordView from "../../components/RecordScreen/recordScreen";
import EmailInput from "../../components/ValidatingEmail/validatingEmail";
import Card from "../../components/Card/Card";
// import RecordView from "../../utils/recordScreen";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { formatDate } from "../../helpers/formatDate";
import EventCard from "../EventsPage/EventCard/EventCard";

const LandingPage = () => {
  const [greeting, setGreeting] = useState("");
  const { currentUser } = useUserContext();
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  console.log(currentUser);
  const navigate = useNavigate();

  const handleShowAddEventModal = () => {
    setShowAddEventModal(true);
  };

  useEffect(() => {
    const time = new Date().getHours();
    if (time < 10) return setGreeting("Good Morning");
    if (time < 20) return setGreeting("Good Day");

    setGreeting("Good Evening");
  }, []);
  return (
    <>
      <main className={styles.wrapper}>
        <section className={styles.nav__content}>
          <h2>
            <span>
              Hello {currentUser?.userinfo?.first_name}{" "}
              {currentUser?.userinfo?.last_name}
            </span>
            <span className={styles.greeting}>{greeting}</span>
          </h2>
          <button onClick={handleShowAddEventModal}>
            <IoAddCircleOutline />
            <span>Add</span>
          </button>
        </section>

        {showAddEventModal && (
          <AddEventModal handleCloseModal={() => setShowAddEventModal(false)} />
        )}
        <div className={styles.main__content}>
          <div className={styles.event__header}>
            <h3>My Events</h3>
            <button onClick={() => navigate("/dowellproctoring/events")}>
              View All <MdKeyboardDoubleArrowRight className={styles.arrow} />
            </button>
          </div>
          <section className={styles.main__content__wrapper}>
            <EventCard
              eventName={"Event Name"}
              startTime={"10:00 AM"}
              endTime={"11:00 AM"}
              participants={10}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
