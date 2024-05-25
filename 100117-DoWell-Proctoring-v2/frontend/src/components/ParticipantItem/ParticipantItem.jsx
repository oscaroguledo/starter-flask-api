/* eslint-disable react/prop-types */
import Avatar from "react-avatar";
import styles from "./styles.module.css";

export default function ParticipantItem({
  item,
  isImageItem,
  isNotParticipantItem,
}) {
  return (
    <>
      <div>
        {isImageItem ? (
          <Avatar
            name={isNotParticipantItem ? item : item?.applicant}
            round={true}
            size="3rem"
          />
        ) : (
          <p className={styles.item__Wrap}>{item}</p>
        )}
      </div>
    </>
  );
}
