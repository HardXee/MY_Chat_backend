import { Server } from "socket.io";
import Message from "../modles/messageModel.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // fronted url 
      credentials: true,
    },
  });

  io.on("connection", (socket) => { 
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });


    socket.on("join_room", (roomId) => {
      socket.join(roomId);

      

      console.log(`User joined room: ${roomId}`);
    });


    socket.on("send_message",async(data) => {

      const savedMessage = await Message.create({
        roomId: data.roomId,
        sender : data.sender,
        receiver : data.receiver,
        text : data.text,

      });

      
       io.to(data.roomId).emit("receive_message", savedMessage);

    })


  });




};

export const getIO = () => {
  return io;
};