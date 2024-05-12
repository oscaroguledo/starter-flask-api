import { React, useEffect, useRef, useState } from "react";
import { registerForEvent } from "../../../services/participantServices";
import { useSearchParams } from "react-router-dom";
import styles from "./styles.module.css";
import dowellLogo from "../../../assets/logo.png";
import expiredIllus from "../../../assets/expired-illustration.svg";
import DotLoader from "../../../components/DotLoader/DotLoader";
import { toast } from 'sonner';
import { getSavedPublicUserFromLocalStorage, validateEmail } from "../../../utils/utils";
import { PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE } from "../../../utils/constants";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import EyeTracker from "../../../components/EyeTracker/EyeTracker";
import useStartCountDown from "../hooks/useStartCountdown";
import useLoadEventDetail from "../hooks/useLoadEventDetail";
import useSocketIo from "../../../hooks/useSocketIo";
import { handleRequestCameraPermission } from "../../../utils/helpers";
import { PiWechatLogoDuotone } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { socketInstance } from "../../../utils/utils";
import useUpdateEventStartTime from "../hooks/useUpdateEventStartTime";
import ScreenCapture from "../../../components/CaptureScreen/captureScreen";
import { getMessages } from "../../../services/eventServices";

const dummyLink = "https://ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJXb3JrZmxvdyBBSSIsImRldGFpbHMiOnsiZmllbGQiOiJkb2N1bWVudF9uYW1lIiwiY2x1c3RlciI6IkRvY3VtZW50cyIsImRhdGFiYXNlIjoiRG9jdW1lbnRhdGlvbiIsImNvbGxlY3Rpb24iOiJDbG9uZVJlcG9ydHMiLCJkb2N1bWVudCI6IkNsb25lUmVwb3J0cyIsInRlYW1fbWVtYmVyX0lEIjoiMTIxMjAwMSIsImZ1bmN0aW9uX0lEIjoiQUJDREUiLCJjb21tYW5kIjoidXBkYXRlIiwiZmxhZyI6InNpZ25pbmciLCJfaWQiOiI2NWZlZDhjNzM3YzZkNmNmMTQ2YTFkOTAiLCJhY3Rpb24iOiJkb2N1bWVudCIsImF1dGhvcml6ZWQiOiJzYWdhci1oci1oaXJpbmciLCJ1c2VyX2VtYWlsIjoiIiwidXNlcl90eXBlIjoicHVibGljIiwiZG9jdW1lbnRfbWFwIjpbeyJjb250ZW50IjoiczEiLCJyZXF1aXJlZCI6ZmFsc2UsInBhZ2UiOjF9LHsiY29udGVudCI6ImkyIiwicmVxdWlyZWQiOmZhbHNlLCJwYWdlIjoyfSx7ImNvbnRlbnQiOiJpMyIsInJlcXVpcmVkIjpmYWxzZSwicGFnZSI6Mn0seyJjb250ZW50IjoiaTQiLCJyZXF1aXJlZCI6ZmFsc2UsInBhZ2UiOjJ9LHsiY29udGVudCI6Imk1IiwicmVxdWlyZWQiOmZhbHNlLCJwYWdlIjoyfV0sImRvY3VtZW50X3JpZ2h0IjoiYWRkX2VkaXQiLCJkb2N1bWVudF9mbGFnIjoicHJvY2Vzc2luZyIsInJvbGUiOiJGcmVlbGFuY2VyIiwicHJldmlvdXNfdmlld2VycyI6bnVsbCwibmV4dF92aWV3ZXJzIjpbIkR1bW15SFIiXSwibWV0YWRhdGFfaWQiOiI2NWZlZDhjODQwMDE2MmQ3MDRkNjk1MmEiLCJwcm9jZXNzX2lkIjoiNjVmZWQ4YzJiODZlM2E0ZTYwMGJiNDc3IiwidXBkYXRlX2ZpZWxkIjp7ImRvY3VtZW50X25hbWUiOiJVbnRpdGxlZCBEb2N1bWVudF9zYWdhci1oci1oaXJpbmciLCJjb250ZW50IjoiIiwicGFnZSI6IiJ9fX0.lX91uUpJY6oubfhKqLfJsX1IHW87-YkDXpHWqfshFQU&link_id=2130413081054482926";

const EventRegistrationPage = () => {
    const [eventDetailLoading, setEventDetailLoading] = useState(true);
    const [foundEventDetail, setFoundEventDetail] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentFormPage, setCurrentFormPage] = useState(0);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        user_image: '',
        event_id: '',
        user_lat: '',
        user_lon: '',
    });
    const [activeUserStream, setActiveUserStream] = useState(null);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [locationAccessGranted, setLocationAccessGranted] = useState(false);
    const [eventRegistrationLoading, setEventRegistrationLoading] = useState(false);
    const [eventStarted, setEventStarted] = useState(false);
    const [countDownTimer, setCountDownTimer] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [initialCountDownBegun, setInitialCountDownBegun] = useState(false);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadedOnce,setChatLoadedOnce] = useState(false);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const data = {
            eventId: foundEventDetail?._id,
            email: userDetails?.email,
            username: userDetails?.name,
            isProctor: false,
            message: newMessage.trim(),
        };

        console.log('send message from public end', data);

        setChatMessages(prevMessages => [...prevMessages, { ...data, user: 'me' }]);
        setNewMessage('');

        socketInstance.emit('incoming-message', data);

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    useEffect(() => {
        if (!socketInstance) return;

        const handleNewMessage = (eventId, userName, userEmail, isProctor, message, messageCreatedDate) => {

            const receivedMessage = {
                eventId: eventId,
                username: userName,
                email: userEmail,
                isProctor: isProctor,
                message: message,
                createddate: messageCreatedDate,
            }

            console.log('recieved message on public end', receivedMessage);

            setChatMessages(prevMessages => [...prevMessages, receivedMessage]);

            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        socketInstance.on('new-message', handleNewMessage);

        return () => {
            socketInstance.off('new-message', handleNewMessage);
        };
    }, [socketInstance]);

    const fetchChatMessages = async () => {
        if(chatLoadedOnce) return
        setIsChatLoading(true);
        try {
            const response = await getMessages({ "eventId": foundEventDetail?._id });
            console.log('chat responseeeeee', response?.data?.data);
            setChatMessages(response?.data?.data);
            setChatLoadedOnce(true);
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        } finally {
            setIsChatLoading(false);
        }

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const toggleChat = () => {
        setIsChatOpen(prev => !prev);
        fetchChatMessages();
    };

    const videoRef = useRef();

    const handleUpdateUserDetail = (name, val) => {
        setUserDetails((prevVal) => {
            return {
                ...prevVal,
                [name]: val,
            }
        })
    }

    useLoadEventDetail(
        foundEventDetail,
        setFoundEventDetail,
        setCurrentFormPage,
        setEventDetailLoading,
        setEventStarted,
        setUserDetails,
        async () => {
            const res = await handleRequestCameraPermission();
            if (res.error) toast.info(res.error);
            if (!res.error) {
                setCameraPermissionGranted(true);
                setActiveUserStream(res);

                if (videoRef.current) videoRef.current.srcObject = res;
            }
            handleRequestLocationAccess();
        },
    )

    useEffect(() => {
        if (activeUserStream !== null) {
            console.log('streamm ->>>', activeUserStream);
            setCameraPermissionGranted(true);
            if (videoRef.current) videoRef.current.srcObject = activeUserStream;
        }
    }, [currentFormPage])

    useStartCountDown(
        eventStarted,
        userDetails,
        foundEventDetail,
        iframeLoading,
        initialCountDownBegun,
        setInitialCountDownBegun,
        setCountDownTimer
    );

    useSocketIo(
        !iframeLoading,
        foundEventDetail?._id,
        userDetails.email,
        userDetails.name,
        activeUserStream,
    );

    useUpdateEventStartTime(
        iframeLoading,
        eventStarted,
        foundEventDetail,
        userDetails,
        setUserDetails,
    );

    const handleGoToNextPage = async () => {
        const nextPage = currentFormPage + 1;

        switch (nextPage) {
            case 1:
                setCurrentFormPage(nextPage);
                return;
            case 2:
                if (userDetails.name.length < 1) return toast.info('Please enter your name');
                if (userDetails.email.length < 1) return toast.info('Please enter your email');
                if (!validateEmail(userDetails.email)) return toast.info('Please enter a valid email');

                setCurrentFormPage(nextPage);
                return;
            case 3:
                if (!cameraPermissionGranted) return toast.info('Please grant access to your audio and video before proceeding');

                setCurrentFormPage(nextPage);
                return;
            case 4: {
                if (eventRegistrationLoading) return;
                if (!locationAccessGranted) return toast.info('Please grant access to your location before proceeding');

                const copyOfUserDetails = { ...userDetails };
                copyOfUserDetails.event_id = searchParams.get('event_id');

                setEventRegistrationLoading(true);

                const allSavedEventDetailsForUser = getSavedPublicUserFromLocalStorage();

                const updatedEventsForUser = allSavedEventDetailsForUser && Array.isArray(allSavedEventDetailsForUser) ?
                    allSavedEventDetailsForUser
                    :
                    [];

                try {
                    const res = (await registerForEvent(copyOfUserDetails)).data;
                    console.log(res?.data);

                    updatedEventsForUser.push({ ...res?.data });
                    localStorage.setItem(PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE, JSON.stringify(updatedEventsForUser));
                    setUserDetails(res?.data);

                    setEventRegistrationLoading(false);
                    setEventStarted(true);
                } catch (error) {
                    if (error?.response?.status === 409) {
                        const eventDetailForUserIsAlreadySaved = updatedEventsForUser.find(item => item.event_id === searchParams.get('event_id'));
                        if (!eventDetailForUserIsAlreadySaved) {
                            updatedEventsForUser.push(error?.response?.data?.data);
                            localStorage.setItem(PUBLIC_USER_DETAIL_KEY_IN_LOCAL_STORAGE, JSON.stringify(updatedEventsForUser));
                        }
                        setUserDetails(error?.response?.data?.data);

                        setEventRegistrationLoading(false);
                        setEventStarted(true);

                        return;
                    }

                    toast.error(error?.response?.data?.message);
                    setEventRegistrationLoading(false);
                }

                return;
            }
            default:
                console.log("no case defined");
                return;
        }
    }

    const handleRequestLocationAccess = () => {
        navigator.geolocation.getCurrentPosition((position => {
            handleUpdateUserDetail('user_lat', position.coords.latitude);
            handleUpdateUserDetail('user_lon', position.coords.longitude);

            setLocationAccessGranted(true);
        }), (error) => {
            console.log(error);
            toast.info('Please approve location request');
        })
    }

    if (eventStarted) return <ScreenCapture
        captureScreen={true}
        eventId={foundEventDetail?._id}
        participantId={userDetails?._id}
    >
        <div className={styles.event__Wrapper}>
            <div className={styles.event__Live__Info}>
                <h3>{foundEventDetail?.name}</h3>
                <p><span>{`${countDownTimer?.days < 10 ? '0' : ''}${countDownTimer?.days}`}days {`${countDownTimer?.hours < 10 ? '0' : ''}${countDownTimer?.hours}`}hours {`${countDownTimer?.minutes < 10 ? '0' : ''}${countDownTimer?.minutes}`}minutes {`${countDownTimer?.seconds < 10 ? '0' : ''}${countDownTimer?.seconds}`}seconds</span> left</p>
            </div>
            {
                iframeLoading && <div
                    className={styles.event__Iframe}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <DotLoader />
                </div>
            }
            <iframe
                // src={foundEventDetail?.link} 
                src={dummyLink}
                title="Event Link"
                className={iframeLoading ? styles.hidden__Frame : styles.event__Iframe}
                onLoad={() => {
                    setIframeLoading(false)
                }}
            >
            </iframe>
            <div className={styles.floating__icon} onClick={toggleChat}>
                <PiWechatLogoDuotone fontSize={'3rem'} color="#fff" />
            </div>
            <div className={styles.chatModal} style={{ display: isChatOpen ? 'block' : 'none' }}>
                <div className={styles.chat__bar}>
                    <p className={styles.chat__title}>Chat</p>
                    <MdCancel className={styles.closeBtn} onClick={toggleChat} fontSize={'1.2rem'} color="red" />
                </div>
                {
                    isChatLoading ? <div className={styles.chat__main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DotLoader /></div> :
                        <div ref={chatContainerRef} className={styles.chat__main}>
                            {chatMessages.map((message, index) => (
                                <div
                                    className={styles.chat_message}
                                    key={index}  // Use index as key
                                >
                                    <div className={styles.avatarContainer}>
                                        <div className={styles.avatar}>
                                            {message.username[0].toUpperCase()}
                                        </div>
                                    </div>
                                    <div className={styles.chat__message}>
                                        <div className={styles.messageContent}>
                                            <strong>{message.username}: </strong>
                                            {message.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                }

                <div className={styles.chat__inputWrapper}>
                    <div className={styles.chat__input}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isChatLoading}
                        />
                    </div>
                </div>
            </div>

            {/* <div className={styles.track__Container}>
                <EyeTracker />
            </div> */}

        </div>
    </ScreenCapture>

    return <>
        <div className={styles.wrapper}>
            <div className={styles.event__Card}>
                <img
                    src={dowellLogo}
                    alt="dowell logo"
                    className={styles.logo}
                />

                {
                    eventDetailLoading ? <DotLoader /> :

                        !foundEventDetail ? <>
                            <h3>Event not found</h3>
                            <img
                                src={expiredIllus}
                                alt="illustration"
                                className={styles.event__Ended__Illus}
                            />
                            <div className={styles.event__Details}>
                                <p style={{ textAlign: 'center' }}><span className={styles.info__Bold}>We cannot seem to find this event, it has either been deleted or it does not exist</span></p>
                            </div>
                        </>
                            :
                            new Date().getTime() > new Date(foundEventDetail?.close_date).getTime() ?
                                <>
                                    <h3>This event is over</h3>
                                    <img
                                        src={expiredIllus}
                                        alt="illustration"
                                        className={styles.event__Ended__Illus}
                                    />
                                </>
                                :
                                <>
                                    <h3>{foundEventDetail?.name}</h3>

                                    <div className={styles.event__Details}>
                                        {
                                            currentFormPage === 0 ? <>
                                                <p><span className={styles.info__Bold}>Starts: </span>{new Date(foundEventDetail?.start_time).toDateString()} by {new Date(foundEventDetail?.start_time).toLocaleTimeString()}</p>
                                                <p><span className={styles.info__Bold}>Ends: </span>{new Date(foundEventDetail?.close_date).toDateString()} by {new Date(foundEventDetail?.close_date).toLocaleTimeString()}</p>
                                                <br />
                                                <p><span className={styles.info__Bold}>Time allowed: </span>{isNaN(foundEventDetail?.duration_in_hours) ? foundEventDetail?.duration_in_hours : Number(foundEventDetail?.duration_in_hours).toLocaleString()} hour{foundEventDetail?.duration_in_hours > 1 ? 's' : ''}</p>
                                            </>
                                                :
                                                currentFormPage === 1 ?
                                                    <div className={styles.user__Detail}>
                                                        <label>
                                                            <span>Name</span>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                value={userDetails.name}
                                                                onChange={({ target }) => handleUpdateUserDetail(target.name, target.value)}
                                                            />
                                                        </label>
                                                        <label>
                                                            <span>Email</span>
                                                            <input
                                                                type="text"
                                                                name="email"
                                                                value={userDetails.email}
                                                                onChange={({ target }) => handleUpdateUserDetail(target.name, target.value)}
                                                            />
                                                        </label>
                                                    </div>
                                                    :
                                                    currentFormPage === 2 ?
                                                        <div className={styles.user__Detail}>
                                                            <video ref={videoRef}
                                                                autoPlay
                                                                playsInline
                                                                controls={false}
                                                                controlsList="nofullscreen"
                                                                className={`${styles.video__Item} ${!cameraPermissionGranted ? styles.no__Display : ''}`}
                                                            >

                                                            </video>
                                                            {
                                                                cameraPermissionGranted ? <>
                                                                    <p>Please ensure your face is fully visible in the frame before clicking &apos; Next &apos;</p>
                                                                </> :
                                                                    <>
                                                                        <p>Please grant access to your video and audio by clicking the button below</p>
                                                                        <button
                                                                            style={{
                                                                                width: 'max-content',
                                                                                margin: '0 auto'
                                                                            }}
                                                                            className={styles.back_Btn}
                                                                            onClick={() => {
                                                                                handleRequestCameraPermission().then(res => {
                                                                                    if (res.error) {
                                                                                        toast.info(res.error);
                                                                                        return;
                                                                                    }

                                                                                    setCameraPermissionGranted(true);
                                                                                    setActiveUserStream(res);

                                                                                    if (videoRef.current) videoRef.current.srcObject = res;

                                                                                }).catch(err => {
                                                                                    console.log(err);
                                                                                })
                                                                            }
                                                                            }
                                                                        >
                                                                            Grant permission
                                                                        </button>
                                                                    </>
                                                            }
                                                            <br />
                                                        </div>
                                                        :
                                                        currentFormPage === 3 ? <>
                                                            {
                                                                locationAccessGranted ? <></>
                                                                    :
                                                                    <>
                                                                        <p>One last step. Please grant location access by clicking the button below</p>
                                                                        <button
                                                                            style={{
                                                                                width: 'max-content',
                                                                                margin: '10px auto 0',
                                                                                display: 'block',
                                                                            }}
                                                                            className={styles.back_Btn}
                                                                            onClick={handleRequestLocationAccess}
                                                                        >
                                                                            Grant permission
                                                                        </button>
                                                                    </>
                                                            }
                                                        </>
                                                            :
                                                            <></>
                                        }
                                    </div>

                                    <div className={styles.btn__nav__Wrap}>
                                        {
                                            currentFormPage > 0 &&
                                            <button className={styles.back_Btn} onClick={() => setCurrentFormPage(currentFormPage - 1)}>
                                                Back
                                            </button>
                                        }
                                        <button
                                            className={styles.start_Btn}
                                            onClick={handleGoToNextPage}
                                            disabled={
                                                (
                                                    (currentFormPage > 2 && !locationAccessGranted) ||
                                                    eventRegistrationLoading
                                                ) ?
                                                    true
                                                    :
                                                    false
                                            }
                                        >
                                            {
                                                eventRegistrationLoading ? <LoadingSpinner />
                                                    :
                                                    currentFormPage <= 2 ?
                                                        'Next'
                                                        :
                                                        'Begin'
                                            }
                                        </button>
                                    </div>
                                </>
                }
            </div>
        </div>
    </>
}

export default EventRegistrationPage;