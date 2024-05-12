import styles from "./styles.module.css";
import PropTypes from "prop-types";
import logo from "../../assets/logo.png";
import React, { useRef, useState } from "react";
import { userNavLinks } from "./utils";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useUserContext } from "../../contexts";
import { DOWELL_LOGOUT_URL } from "../../utils/constants";
import useClickOutside from "../../hooks/useClickOutside";

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const [showUserActionsTab, setShowUserActionsTab] = useState(false);
  const userActionWrapref = useRef();

  const { currentUser } = useUserContext();

  const handleLogout = () => {
    window.location.replace(DOWELL_LOGOUT_URL);
  };

  useClickOutside(userActionWrapref, () => setShowUserActionsTab(false));

  return (
    <>
      <section className={styles.wrapper}>
        <section className={styles.side__Nav}>
          <div className={styles.logo__item}>
            <img src={logo} alt="logo" />
            <h2>Dowell Proctoring</h2>
          </div>
          <ul className={styles.user__Links__Wrap}>
            {React.Children.toArray(
              userNavLinks.map((linkItem) => {
                return (
                  <li onClick={() => navigate(linkItem?.path)}>
                    <span>
                      <linkItem.icon />
                    </span>
                    <span>{linkItem.name}</span>
                  </li>
                );
              })
            )}
          </ul>

          <div className={styles.user__Info__Wrap}>
            <div className={styles.user__Info}>
              <img src={currentUser?.userinfo?.profile_img} />
              <p>
                {currentUser?.userinfo?.first_name}{" "}
                {currentUser?.userinfo?.last_name}
              </p>
            </div>
            <HiOutlineDotsVertical
              cursor={"pointer"}
              fontSize={"1rem"}
              onClick={() => setShowUserActionsTab(true)}
            />

            {showUserActionsTab && (
              <div className={styles.user__Actions} ref={userActionWrapref}>
                <button className={styles.logout__Btn} onClick={handleLogout}>
                  <CiLogout fontSize={"1rem"} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </section>
        <section className={styles.app__Content}>{children}</section>
      </section>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
};

export default AppLayout;
