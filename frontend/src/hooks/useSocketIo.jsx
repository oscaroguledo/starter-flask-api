import { useEffect } from "react";
import { socketInstance } from "../utils/utils";
import { Peer } from "peerjs";
import { peerServerHost, peerServerPath, peerServerPort } from "../services/config";

export default function useSocketIo(
    canStartUsing=false,
    eventId,
    userEmail,
    userName,
    currentUserStream=null,
    updateParticipants = () => {},
    updateCurrentUserPeerId = () => {},
) {
    useEffect(() => {
        if (!canStartUsing) return;

        const peer = new Peer(undefined, {
            host: peerServerHost,
            // port: peerServerPort,
            path: peerServerPath,
            secure: true,
        });

        peer.on('open', (id) => {
            console.log('current user peer id::' + id + ', and email::' + userEmail);
            updateCurrentUserPeerId(id);
            socketInstance.emit('join-event', eventId, id, userEmail, userName);
        });
        
        peer.on('call', (call) => {
            call.answer(currentUserStream);

            call.on('stream', (passedStream) => {
                console.log('new stream 1 ->', passedStream);
                updateParticipants(peer.id, passedStream);
            })
        })

        const handleNewUserConnect = (userPeerId, emailConnected, nameOfUserConnected) => {
            console.log('new user connecting->>>>>', userPeerId, emailConnected, nameOfUserConnected);
            
            const peerCall = peer.call(userPeerId, currentUserStream);
            
            peerCall.on('stream', (passedStream) => {
                console.log('new stream 2 ->', passedStream);
                updateParticipants(userPeerId, passedStream);
            })

            peerCall.on('close', () => {
                console.log('enddnd');
            })
        };

        socketInstance.on('user-connected', handleNewUserConnect);

        const handleUserDisconnect = (userPeerId, emailConnected, nameOfUserDisconnected) => {
            console.log('user disconnecting->>>>>', userPeerId, emailConnected, nameOfUserDisconnected);
            updateParticipants(userPeerId, null, true);
        };

        socketInstance.on('user-disconnected', handleUserDisconnect);

        return (() => {
            socketInstance.off('user-connected', handleNewUserConnect);
            socketInstance.off('user-disconnected', handleUserDisconnect);
        })

    }, [canStartUsing])
}