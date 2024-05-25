import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { socketInstance } from "../../../utils/utils";
import { toast } from 'sonner';

export default function TestingChatPage() {
    const [ value, setValue ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const [ searchParams, setSearchParams ] = useSearchParams();
    
    const eventId = searchParams.get('event_id');
    const testEmail = 'test@gmail.com';
    const testUser = 'John Doe';

    let activityTimer
    const emmitter =(event,data) =>{
        socketInstance.emit(event,data);
    }

    const handleSend = () => {
        if (value.length < 1) return toast.info('Please enter a message');
        
        const data={
            'eventId':eventId,
            'email':testEmail,
            'username':testUser,
            'isProctor':false,
            'message':value
        }

        const currentMessages = messages.slice();

        emmitter('incoming-message', data);

        setValue('');

        currentMessages.push({
            ...data,
            name: data.username,
            createddate: new Date(),
        });

        console.log('updated messages ->>', currentMessages);

        setMessages(currentMessages);
    }

    socketInstance.on('new-message', (eventId, userName,userEmail, isProctor, message, messagecreateddate) => {
        const currentMessages = messages.slice();
        console.log('prev messages ->>', currentMessages);

        currentMessages.push({
            eventId: eventId,
            name: userName,
            email: userEmail,
            isProctor: isProctor,
            message: message,
            createddate: messagecreateddate,
        });

        console.log('updated messages ->>', currentMessages);

        setMessages(currentMessages);

        // setMessages(prevMessages => {
        //     // Check if there is already a message with the same messageid
        //     const existingMessage = prevMessages.find(msg => msg.messageid === messageid);
        //     // If no existing message with the same messageid is found and there is a username, add the new message
        //     if (!existingMessage && !(userName==undefined)) {
        //         return [...prevMessages, {
        //             eventId: eventId,
        //             name: userName,
        //             email:userEmail,
        //             isProctor: isProctor,
        //             messageid: messageid,
        //             message: message,
        //             createddate: messagecreateddate
        //         }];
        //     }
        //     return prevMessages;
        // });
    });

    socketInstance.on("activity", (data) => {
        document.getElementById('activity').innerHTML = `${data.username} is typing...`

        // Clear after 1.5 seconds 
        clearTimeout(activityTimer)
        activityTimer = setTimeout(() => {
            document.getElementById('activity').textContent = ""
        }, 1500)
    })
    
    useEffect(() => {
        
        socketInstance.emit('join-event', eventId, crypto.randomUUID(), testEmail, testUser);
        
    }, [eventId])

    return <div
        style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem',
        }}
    >
        <br />
        <h2>Live Chat</h2>
        <input 
            type="text"
            onChange={({ target }) => setValue(target.value)}
            onKeyDown={( target ) => emmitter('on-typing', {'email':testEmail,'username':testUser,'eventId':eventId})}
            value={value}
        />
        <button onClick={handleSend}>Send</button>
        
        <h3>Messages</h3>
        <div className="message">
            {React.Children.toArray(
                messages.map((messageItem, index) => (
                    <div style={{ backgroundColor: '#efefef', padding: '1rem', borderRadius: '10px', margin: '12px' }}>
                        <small>Date: <span style={{ fontSize: '0.8rem' }}>{new Date(messageItem.createddate).toDateString()} {new Date(messageItem.createddate).toLocaleTimeString()}</span></small>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <p style={{ fontSize: '0.8rem' }}>{messageItem.name}</p>
                            <p style={{ fontSize: '0.8rem' }}>{messageItem.email}</p>
                        </div>
                        <p>{messageItem.message}</p>
                    </div>
                ))
            )}
        </div>
        <p id="activity"></p>
 
    </div>
}