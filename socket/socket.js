import { Server } from "socket.io";
import Message from "../modles/messageModel.js";
import Convo from "../modles/conversation.model.js";

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


    socket.on("send_message", async (data) => {
      try {
            if (!data.text || data.text.trim() === "") {
              return;
            }

            const roomid = data.roomId
            const convo = await Convo.findOne({
              roomId: roomid
            }) 


  // ----------------------------------

            if(!convo) {
              await Convo.findOneAndUpdate(
                  {
                    roomId: data.roomId,
                  },

                  {
                    participants: [data.sender, data.receiver],

                    lastMessage: {
                      text: data.text,
                      sender: data.sender,
                      createdAt: new Date(data.createdAt),
                    },
                  },

                  {
                    upsert: true,
                    new: true,
                  },
              );

            }
            else{
              await Convo.findOneAndUpdate(
                  {
                    roomId: data.roomId,
                  },

                  {
                    participants: [data.sender, data.receiver],

                    lastMessage: {
                      text: data.text,
                      sender: data.sender,
                      createdAt: data.createdAt,
                    },
                  },

                  {
                  returnDocument: "after"
                  },
              );
            }


    // ----------------
            const savedMessage = await Message.create({
              roomId: data.roomId,
              sender: data.sender,
              receiver: data.receiver,
              text: data.text,
              createdAt: data.createdAt
            });
            

          

            const storemessage = await Message.create(savedMessage);
            console.log(storemessage)

            // console.log(savedMessage.text)
            io.to(data.roomId).emit("receive_message", savedMessage);

        } catch (error) {
          console.log(error);
        }
    });


  });




};

export const getIO = () => {
  return io;
};