/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./styles.module.css";
import Card from "../../../components/Card/Card";

const EventCard = ({ eventName, startTime, endTime, participants }) => {
  return (
    <>
      <Card className={styles.card__content}>
        <h1 className={styles.title}>{eventName}</h1>
        <div>
          <p>
            Start Date: <span>{startTime}</span>
          </p>
          <p>
            End Date: <span>{endTime}</span>
          </p>
        </div>
        <div>number of participants</div>
        <div className={styles.card__footer}>
          <button>View</button>
        </div>
      </Card>
    </>
  );
};

export default EventCard;
