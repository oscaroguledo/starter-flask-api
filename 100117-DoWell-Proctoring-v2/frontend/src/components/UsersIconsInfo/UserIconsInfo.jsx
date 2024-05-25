/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import ParticipantItem from "../ParticipantItem/ParticipantItem";
import styles from "./styles.module.css";

export default function UserIconsInfo({
  items,
  numberOfIcons,
  isNotParticipantItem,
}) {
  if (!items || !Array.isArray(items) || isNaN(numberOfIcons)) return <></>;

  return (
    <div className={styles.nav__Users__Content}>
      <>
        {React.Children.toArray(
          items?.slice(0, numberOfIcons)?.map((applicant) => {
            return (
              <ParticipantItem
                item={applicant}
                isImageItem={true}
                isNotParticipantItem={isNotParticipantItem}
              />
            );
          })
        )}
      </>
      {items?.slice(numberOfIcons)?.length > 0 ? (
        <ParticipantItem
          item={`+${items?.slice(numberOfIcons)?.length}`}
          isNotParticipantItem={isNotParticipantItem}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
