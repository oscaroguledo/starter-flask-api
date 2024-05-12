/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import { useState } from "react";
import Overlay from "../../../components/DotLoader/Overlay/Overlay";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { BiRightTopArrowCircle } from "react-icons/bi";
import styles from "./styles.module.css";
import { toast } from "sonner";
import { addNewEvent } from "../../../services/eventServices";
import { useUserContext } from "../../../contexts";
import EmailInput from "../../../components/ValidatingEmail/validatingEmail";
import { TbCopy } from "react-icons/tb";
import { PiArrowElbowRightThin } from "react-icons/pi";

const AddEventModal = ({ handleCloseModal }) => {
  const [event, setEvent] = useState({
    name: "",
    start_time: "",
    close_date: "",
    duration_in_hours: "",
    max_cap: "",
    link: "",
  });
  console.log(event);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopiedId] = useState("");
  const [eventId, setEventId] = useState("");

  const { currentUser } = useUserContext();

  const handleChange = (valueEntered, inputName) => {
    setEvent((prevValue) => ({
      ...prevValue,
      [inputName]: valueEntered,
    }));
  };

  const handleNumericChange = (valueEntered, inputName) => {
    const filteredValue = valueEntered.replace(/[^0-9]/g, "");
    setEvent((prevValue) => ({
      ...prevValue,
      [inputName]: filteredValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredKeys = [
      "name",
      "start_time",
      "close_date",
      "duration_in_hours",
      "link",
    ];

    const newEvent = {
      name: event.name,
      start_time: event.start_time,
      close_date: event.close_date,
      duration_in_hours: event.duration_in_hours,
      max_cap: event.max_cap,
      link: event.link,
      user_id: currentUser?.userinfo?.userID,
    };

    const missingRequiredKey = Object.keys(newEvent || {}).find(
      (key) =>
        requiredKeys.includes(key) &&
        (!newEvent[key] || newEvent[key]?.length < 1)
    );

    if (missingRequiredKey)
      return toast.info("Please fill in all required fields");
    if (
      new Date(newEvent.start_time).getTime() >
      new Date(newEvent.close_date).getTime()
    )
      return toast.info(
        "The 'Start Date' of the event should be before its 'Close Date'"
      );

    if (new Date(newEvent.start_time).getTime() < new Date().getTime())
      return toast.info("'Start Date' of the event cannot be in the past");

    // handleAddEvent(newEvent);

    console.log(newEvent);
    setLoading(true);

    try {
      const res = (await addNewEvent(newEvent)).data;
      const id = res?.data?._id;
      setEventId(id);
      console.log(res);

      setLoading(false);

      toast.success("Successfully added new event!");
      // handleCloseModal();
      setShowShareModal(true);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <section className={styles.event__Modal__wrapper}>
        <div style={{ width: "100%" }}>
          <AiOutlineClose
            onClick={handleCloseModal}
            className={styles.close__event__modal}
          />
        </div>
        {showShareModal ? (
          <div style={{ width: "100%" }}>
            <h2 style={{ marginBottom: "1rem", color: "#005734" }}>
              Invite people to your event
            </h2>
            <label htmlFor="link" className={styles.event__share__modal}>
              <div style={{ marginBottom: "0.4rem" }}>
                <span>Share Event link</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  name={"link"}
                  placeholder="Event link"
                  value={`${window.location.origin}/dowellproctoring/?view=public&event_id=${eventId}`}
                  style={{ width: "100%" }}
                />
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/dowellproctoring/?view=public&event_id=${eventId}`
                    );

                    setCopiedId("write-text");
                  }}
                >
                  {copied === "write-text" ? (
                    <>
                      <PiArrowElbowRightThin /> Copied
                    </>
                  ) : (
                    <>
                      <TbCopy /> Copy
                    </>
                  )}
                </button>
              </div>
            </label>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#005734",
                }}
              ></div>
              <p>or</p>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#005734",
                }}
              ></div>
            </div>
            <label htmlFor="emails" className={styles.event__share__modal}>
              <div style={{ margin: "0.4rem 0" }}>
                <span>Invite via email</span>
              </div>
              <EmailInput
                newEvent={event.name}
                eventLink={`${window.location.origin}/dowellproctoring/?view=public&event_id=${eventId}`}
                closeModal={handleCloseModal}
              />
            </label>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.event__form}>
            <h2>Add Event</h2>
            <p className={styles.required__indicator__label}>*Required</p>
            <label htmlFor="name">
              <div>
                <span>Event Title</span>{" "}
                <span className={styles.required__indicator}>*</span>
              </div>
              <input
                type="text"
                name={"name"}
                placeholder="Event title"
                value={event.name}
                onChange={(e) => handleChange(e.target.value, e.target.name)}
              />
            </label>
            <div className={styles.event_body}>
              <div className={styles.event_desc}>
                <label htmlFor="start_time">
                  <div>
                    <span>Start Date</span>{" "}
                    <span className={styles.required__indicator}>*</span>
                  </div>
                  <input
                    type="datetime-local"
                    name={"start_time"}
                    placeholder="Start date"
                    value={event.start_time}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </label>
                <label htmlFor="close_date">
                  <div>
                    <span>Close Date</span>{" "}
                    <span className={styles.required__indicator}>*</span>
                  </div>
                  <input
                    type="datetime-local"
                    name={"close_date"}
                    placeholder="Close date"
                    value={event.close_date}
                    onChange={(e) =>
                      handleChange(e.target.value, e.target.name)
                    }
                  />
                </label>
              </div>
              <div className={styles.event_desc}>
                <label htmlFor="duration_in_hours">
                  <div>
                    <span>Duration in Hours</span>{" "}
                    <span className={styles.required__indicator}>*</span>
                  </div>
                  <input
                    type="text"
                    name={"duration_in_hours"}
                    placeholder="Duration in Hours"
                    value={event.duration_in_hours}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, e.target.name)
                    }
                  />
                </label>
                <label htmlFor="max_cap">
                  <span>Maximum Participants</span>
                  <input
                    type="text"
                    name={"max_cap"}
                    placeholder="Max participants"
                    value={event.max_cap}
                    onChange={(e) =>
                      handleNumericChange(e.target.value, e.target.name)
                    }
                  />
                </label>
              </div>
              <label htmlFor="link">
                <div>
                  <span>Event link</span>{" "}
                  <span className={styles.required__indicator}>*</span>
                </div>
                <input
                  type="text"
                  name={"link"}
                  placeholder="Event link"
                  value={event.link}
                  onChange={(e) => handleChange(e.target.value, e.target.name)}
                />
              </label>
            </div>
            <div className={styles.event__actions}>
              <button type="submit" onClick={handleSubmit} disabled={loading}>
                <BiRightTopArrowCircle />
                {loading ? "Saving..." : "Submit"}
              </button>
              <button onClick={handleCloseModal} disabled={loading}>
                <MdOutlineDeleteOutline />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </Overlay>
  );
};

export default AddEventModal;
