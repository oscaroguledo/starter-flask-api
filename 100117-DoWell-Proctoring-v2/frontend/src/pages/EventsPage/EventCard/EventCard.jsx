/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styles from "./styles.module.css";
import Card from "../../../components/Card/Card";
import UserIconsInfo from "../../../components/UsersIconsInfo/UserIconsInfo";

const EventCard = ({ eventName, startTime, endTime, participants }) => {
  return (
    <div className={styles.card}>
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
        <div>
          <UserIconsInfo
            items={participants}
            numberOfIcons={3}
            isNotParticipantItem={true}
          />
        </div>
      </Card>
      <div className={styles.card__footer}>
        <button>View</button>
      </div>
    </div>
  );
};

export default EventCard;
