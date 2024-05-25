import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts";
import useSocketIo from "../../hooks/useSocketIo";
import { toast } from "sonner";
import React, { useEffect, useRef, useState } from "react";
import styles from './styles.module.css';
import { handleRequestCameraPermission } from "../../utils/helpers";
import dowellLogo from "../../assets/logo.png";
import sampleVideo from "../../assets/test.mp4";
import { getEventById } from "../../services/eventServices";
import LoadingPage from "../LoadingPage/LoadingPage";
import { BsFillChatTextFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { socketInstance } from "../../utils/utils";
import { getMessages } from "../../services/eventServices";
import DotLoader from "../../components/DotLoader/DotLoader";

// let activeUsers = [];
let currentUserPeerId = null;

const ProctorLiveEventPage = () => {
    const {
        currentUser
    } = useUserContext();

    const { eventId } = useParams();
    const [eventLoading, setEventLoading] = useState(true);
    const [existingEventDetails, setExistingEventDetails] = useState(null);
    const [activeUserStream, setActiveUserStream] = useState(null);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const chatContainerRef = useRef(null);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatLoadedOnce, setChatLoadedOnce] = useState(false);

    const participantVideosRef = useRef();

    const handleUpdateUsers = (peerId, userStream, userIsLeaving = false) => {
        console.log('-----adding new user stream----', userStream);
        const copyOfActiveUsers = activeUsers.slice();

        const foundId = userIsLeaving ?
            copyOfActiveUsers.find(item => item?.peerId === peerId)
            :
            copyOfActiveUsers.find(item => item?.id === userStream?.id);

        if (userIsLeaving === true) {
            console.log('active users ->', copyOfActiveUsers);
            console.log('---removing user----', peerId);
            console.log(foundId);
            foundId
            return;
        }

        console.log(foundId);
        if (foundId) return;
        if (peerId === currentUserPeerId) return;

        copyOfActiveUsers.push({
            stream: userStream,
            peerId
        });
        setActiveUsers(copyOfActiveUsers);
    }

    useSocketIo(
        // existingEventDetails && new Date(existingEventDetails?.close_date).getTime() < new Date().getTime() && cameraPermissionGranted,
        cameraPermissionGranted,
        eventId,
        currentUser?.userinfo?.email,
        `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`,
        activeUserStream,
        (passedPeerId, passedUserStream, userLeft) => handleUpdateUsers(passedPeerId, passedUserStream, userLeft),
        (passedPeerId) => currentUserPeerId = passedPeerId,
    );

    useEffect(() => {
        if (existingEventDetails) return setEventLoading(false);

        getEventById(eventId).then(res => {
            setExistingEventDetails(res.data?.data);
            setEventLoading(false);
        }).catch(err => {
            console.log(err?.response?.data);
            setEventLoading(false);
        })

    }, [])

    useEffect(() => {
        if (!existingEventDetails || cameraPermissionGranted) return;

        // if (new Date(existingEventDetails?.close_date).getTime() > new Date().getTime()) return;

        handleRequestCameraPermission(false, true).then(res => {
            if (res.error) {
                toast.info(res.error);
                return;
            }

            setCameraPermissionGranted(true);
            setActiveUserStream(res);
        }).catch(err => {
            console.log(err);
        });

    }, [existingEventDetails])

    useEffect(() => {
        if (!participantVideosRef.current) return;

        Array.from(participantVideosRef.current?.children).forEach((child, index) => {
            if (typeof activeUsers[index]?.stream === 'object') {
                child.srcObject = activeUsers[index]?.stream;
                child.muted = true;
            }
        });

    }, [activeUsers])

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

            console.log('recieved message on proctor end', receivedMessage);

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

    const handleSendMessage = () => {
        console.log('connesction', socketInstance);
        if (newMessage.trim() === '') return;

        const data = {
            eventId: eventId,
            email: currentUser?.userinfo?.email,
            username: `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`,
            isProctor: true,
            message: newMessage.trim(),
        };

        console.log('send message from proctor end', data);

        setChatMessages(prevMessages => [...prevMessages, data]);
        setNewMessage('');

        socketInstance.emit('incoming-message', data);

        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 50);
    };

    const fetchChatMessages = async () => {
        if (chatLoadedOnce) return
        setIsChatLoading(true);
        try {
            const response = await getMessages({ "eventId": eventId });
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

    if (eventLoading) return <LoadingPage />

    return <>
        <div className={styles.wrapper}>
            <nav className={styles.nav__Wrapper}>
                <img
                    className={styles.logo}
                    src={dowellLogo}
                    alt="logo"
                />
                <h3>{existingEventDetails?.name}</h3>
                <BsFillChatTextFill
                    className={styles.chat__icon}
                    color="#005734"
                    onClick={() => {
                        setIsChatOpen(!isChatOpen);
                        fetchChatMessages();
                    }}
                />
            </nav>
            <div className={styles.live_event_wrap}>
                <div ref={participantVideosRef} className={styles.participants__Wrap}>
                    {/* {
                        React.Children.toArray(
                            [...Array(20).fill(0).map(() => ({}))].map(() => {
                                return <video
                                    autoPlay
                                    playsInline
                                    controls={false}
                                    controlsList="nofullscreen"
                                    muted
                                >
                                    <source src={sampleVideo} type="video/mp4" />
                                </video>
                            })
                        )
                    } */}

                    {
                        React.Children.toArray(activeUsers.map(userStreamItem => {
                            return <video
                                autoPlay
                                playsInline
                                controls={false}
                                controlsList="nofullscreen"
                                muted
                            >
                            </video>
                        }))
                    }
                </div>
                <div className={styles.proctor__chat} style={{ display: isChatOpen ? 'block' : 'none' }}>
                    <div className={styles.chat__bar}>
                        <h1 className={styles.chat__heading}>Chats</h1>
                        <IoMdClose
                            fontSize={'28px'}
                            color=""
                            onClick={() => setIsChatOpen(!isChatOpen)}
                        />
                    </div>
                    {
                        isChatLoading ? <div className={styles.chat__main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DotLoader /></div> :
                            <div ref={chatContainerRef} className={styles.chat__main}>
                                {React.Children.toArray(chatMessages.map(message => {
                                    const isCurrentUser = message.username === `${currentUser?.userinfo?.first_name} ${currentUser?.userinfo?.last_name}`;
                                    return (
                                        <div className={`${styles.chat_message} ${isCurrentUser ? styles.chat_messageRight : styles.chat_messageLeft}`}>
                                            <div className={styles.avatarContainer} style={{ display: isCurrentUser ? 'none' : 'block' }}>
                                                <div className={styles.avatar}>
                                                    {message.username[0].toUpperCase()}
                                                </div>
                                            </div>
                                            <div className={styles.main_msg_content}>
                                                <div className={`${styles.username_date} ${styles.username__}`} style={{ justifyContent: isCurrentUser ? 'end' : 'space-between' }}>
                                                    <strong className={styles.username_} style={{ display: isCurrentUser ? 'none' : 'block' }}>
                                                        {message.username}
                                                    </strong>
                                                    <p>{new Date(message.createdAt).toLocaleString()}</p>
                                                </div>
                                                <div className={styles.message_} style={{}}>
                                                    <div key={message.eventId} className={styles.chat__message} style={{ width: isCurrentUser ? 'max-content' : '100%' }}>
                                                        <div className={styles.messageContent}>
                                                            {message.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.avatarContainer} style={{ display: isCurrentUser ? 'block' : 'none', marginLeft: '0.3rem' }}>
                                                <div className={styles.avatar}>
                                                    {message.username[0]}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }))}
                            </div>

                    }
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
        </div>
    </>
}

export default ProctorLiveEventPage;