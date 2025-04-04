import React, { useCallback, useEffect, useState } from 'react'
import {useSocket} from "../context/socketprovider" 
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
    const [email, setEmail] = useState("");
    const [room, setroom] = useState("");
    
      const socket = useSocket()
      const navigate = useNavigate()

    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      console.log("Email:", email, "room:", room);
      socket.emit("room-join",{email,room})
      // Add your authentication logic here
    },[email,room,socket])

    const handlejoin =useCallback((data)=>{
      const {email,room} = data
      console.log(email,room);
      navigate(`/room/${room}`)
      
    },[socket])

    useEffect(()=>{
      socket.on("room-join",handlejoin)

      return () =>{
        socket.off("room-join",handlejoin)
      }
      },[socket,handlejoin])
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center">Join Room</h2>
  
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
  
            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-semibold">
                Room
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 mt-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your room"
                value={room}
                onChange={(e) => setroom(e.target.value)}
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full mt-6 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
            >
              submit
            </button>
          </form>
  
          
        </div>
      </div>
    );
}
