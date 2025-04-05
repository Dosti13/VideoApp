import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/socketprovider'
import ReactPlayer from 'react-player'
import peer from "../service/peer"
export default function Room() {
  const [userjoinid,setuserjoinid] = useState(null)
  const [mystream ,setmystream] = useState()
  const [remoteStream, setRemoteStream] = useState();

  const socket = useSocket()
  const handleuserjoin = useCallback(({email,id})=>{
    console.log(`email ${email} join`);
   
    setuserjoinid(id)
    

  },[])
  const handleincomingcall = useCallback(async({from,offer})=>{
    setuserjoinid(from)
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    console.log("incoming offer ",from,offer);
    setmystream(stream)
    const ans = await peer.getAnswer(offer)
    socket.emit("call:accepted", { to: from, ans });


  },[socket])
  const sendStreams = useCallback(() => {
    for (const track of mystream.getTracks()) {
      peer.peer.addTrack(track, mystream);
    }
  }, [mystream]);
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );
  const handlecalluser = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: userjoinid, offer });
    setmystream(stream)
  }
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);
  useEffect(()=>{
    socket.on("user:joined",handleuserjoin)
    socket.on("incoming:call",handleincomingcall)
    socket.on("call:accepted",handleCallAccepted)
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return ()=> {
      socket.off("user:joined",handleuserjoin)
      socket.off("incoming:call",handleincomingcall)
      socket.off("call:accepted",handleCallAccepted)
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);

    }
  },[socket,handleuserjoin,handleCallAccepted,handleincomingcall])

  return (
    <>
    <h1 className='text-5xl'>Room </h1>
    {userjoinid ? <p>connected</p>:<p>no one in the call</p>}
    {userjoinid && <button onClick={handlecalluser}> Call </button>}
    {mystream && (
        <>
          <h1>my Stream</h1>
          <ReactPlayer
            playing
            height="100px"
            width="200px"
            url={mystream}
          />
        </>
      )}
    {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </>
  )
}
