export const createPeerConnection = (socket, remoteVideoRef, updateRemoteStream) => {
  const peer = new RTCPeerConnection();

  peer.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("ice-candidate", e.candidate);
    }
  };

 peer.ontrack = (e) => {
  const [remoteStream] = e.streams;
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = remoteStream;
    updateRemoteStream(remoteStream); // Zustand update
  }
};


  return peer;
};
