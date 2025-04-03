
import { Server } from "socket.io";
import {} from "cors"


const io = new Server(8000,{
    cors:true,
})
io.on("connection",(socket)=>{
    socket.emit("hello","world")
})