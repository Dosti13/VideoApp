import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/socketprovider'
import ReactPlayer from 'react-player'
export default function Room() {
  const [userjoinid,setuserjoinid] = useState(null)
  const [mystream ,setmystream] = useState()
  const socket = useSocket()
  const handleuserjoin = useCallback(({email,id})=>{
    console.log(`email ${email} join`);
   
    setuserjoinid(id)
    

  },[])
  const handleincomingcall = async({from,offer})=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})

    console.log("incoming offer ",from,offer);
    
  }
  useEffect(()=>{
    socket.on("user:joined",handleuserjoin)
    socket.on("incoming:call",handleincomingcall)
    return ()=> {
      socket.off("user:joined",handleuserjoin)
      socket.off("incoming:call",handleincomingcall)
    }
  },[socket,handleuserjoin])
  const handlecalluser = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: userjoinid, offer });
    setmystream(stream)
  }
  return (
    <>
    <h1 className='text-5xl'>Room </h1>
    {userjoinid ? <p>connected</p>:<p>no one in the call</p>}
    {userjoinid && <button onClick={handlecalluser}> Call </button>}
    <ReactPlayer playing url={mystream}  />
    </>
  )
}
