import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import './App.css';

function PeerTestVideo() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef([null]);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
  }, [])

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }
  const leaveCall = () => {
    // Stop local stream
    const localStream = currentUserVideoRef.current.srcObject;
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Stop remote stream
    const remoteStream = remoteVideoRef.current.srcObject;
    if (remoteStream) {
      const tracks = remoteStream.getTracks();
      tracks.forEach(track => track.stop());
    }

    // Close the call
    if (callInstance.current) {
      callInstance.current.close();
    }

    // Close the peer connection
    if (peerInstance.current) {
      peerInstance.current.disconnect();
    }
  }

  // Define inline style objects
  const styles = {
    app: {
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      backgroundColor: '#f0f2f5',
    },
    header: {
      color: '#333',
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px 10px',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
    videoContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '20px',
    },
    video: {
      width: '65%',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div className="App" style={styles.app}>
      <h1 style={styles.header}>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={e => setRemotePeerIdValue(e.target.value)}
        style={styles.input}
        placeholder="Enter remote peer ID"
      />
      <button
        onClick={() => call(remotePeerIdValue)}
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Call
      </button>
      <button
        onClick={leaveCall}
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Leave Call
      </button>
      <div style={styles.videoContainer}>
        <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
          <video ref={currentUserVideoRef} style={styles.video} autoPlay />
          <span style={{ fontSize: '12px' }}>{peerId}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <video ref={remoteVideoRef} style={styles.video} autoPlay />
          <span style={{ fontSize: '12px' }}>{remotePeerIdValue}</span>
        </div>
      </div>

    </div>
  );
};

export default PeerTestVideo;