/* eslint-disable react/prop-types */
import styles from "./styles.module.css";

const Card = ({ children, className }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};

export default Card;
