
import User from '../modles/user.js'
import Request from '../modles/request.js'
import { response } from 'express';
import mongoose from 'mongoose';
import Convo from '../modles/conversation.model.js';

export const searchUser = async (req,res) => {
    try{
        const {email}  = req.query;

        if (!email) {
            return res.status(400).json({
            message: "Email is required"
            });
        }

        // chekc for the user in the dbl 
        const indb = await User.findOne({email});

        if(!indb){
            return res.status(400).send("user not found");
        }

        return res.status(200).send({
            email: email,
        
        });
    }
    catch(error){
        console.log(error);
    }
}

export const sendRequest = async(req,res) =>{
    try{
        // sender _id , receiver.email,
        const {email} = req.body;
        const senderId = req.user.userID;



            if (!email) {
            return res.status(400).json({
            message: "Email is required"
            });
        }

     

        
        const finduser = await User.findOne({email});
        
        if(!finduser){
            return res.status(400).send("user not found");
        }   
        const receiver  = finduser._id.toString();


        const alreadysent = await Request.find({
            sender:senderId,
            receiver: receiver
            
        })
        
        console.log(alreadysent)
        if(alreadysent.length !== 0 ){

          
            return res.status(400).send('request already sent');
        }

          const request = await Request.create({
                sender: senderId,
                receiver: receiver
            })
           
           
            return res.status(200).send("request sent");
        

    }
    catch(error){
        console.log(error)
        res.status(400).send(error);
    }

}





export const getRequestCount = async(req,res) => {
    try{
          const receiver = req.user.userID;

         const count = await Request.countDocuments({
            receiver: receiver,
            status: "pending"
            });

        if(!count){
             return res.status(400).send("no request found");
        }

        console.log(count);
        
        res.status(200).send(count)
    }
    catch(error){
        console.log(error);
        return res.status(400).send("no request found");
    }
}


export const getReceiverRequests = async(req,res) =>{
    try{
        const receiver = req.user.userID

        const request = await Request.find({
             receiver,
            status: 'pending'
        })
        .populate('sender')
        .exec();

        if(!request){
             return res.status(400).send("no request found");
        }
        

       
        res.status(200).send(request)

    }   
    catch(error){
         console.log(error);
         return res.status(400).send("no request found");
    }
}


export const acceptRequest = async (req,res) => {
    try{
        const receiver = req.user.userID;
        const { sender_id } = req.params;

        console.log(receiver, sender_id);

        // add sender to receiver friend list
        await User.findOneAndUpdate(
        { _id: receiver },
        {
            $addToSet: {
            friends: sender_id,
            },
        },
        { returnDocument: "after" }
        );

        // add receiver to sender friend list
        await User.findOneAndUpdate(
        { _id: sender_id },
        {
            $addToSet: {
            friends: receiver,
            },
        },
        { returnDocument: "after" }
        );

        // update request status
        await Request.findOneAndUpdate(
        {
            sender: sender_id,
            receiver: receiver,
            status: "pending",
        },
        {
            status: "accepted",
        }
        );

        return res.status(200).send({
            status: 'success',
            message: "request accepted"});
    }
    catch (error) {
        console.log(error.message);

        return res.status(400).json({
        success: false,
        message: error.message,
        });
    }   

}


export const getFrends = async (req,res) => {
   try {
        const user_id = req.user.userID;
        const user = await User.findById(user_id).populate("friends",("name email"))
        
      //  console.log(user.friends);
        let arr = user.friends;
     //  console.log(arr)
    
        const friendsmap = new Map();
       
        for (let i = 0; i < user.friends.length; i++) {
         //   console.log(arr[i]._id.toString());
            
          //  let roomid = [user_id , arr[i]._id.toString()].sort().join("_") ;
           // console.log(roomid)
           // let convores = await Convo.findOne({roomId: roomid});

           let convores = await Convo.findOne( { participants:{
                    $all: [user_id,arr[i]._id]}
                } 
            )
           // console.log(convores?.lastMessage?.text);
            let lastmessage = convores?.lastMessage?.text;
            let updatedAt = convores?.updatedAt
            friendsmap.set(arr[i]._id.toString(),{lastmessage,updatedAt})

        }
       
        const friendsMap = Object.fromEntries(friendsmap);
       // console.log({user,friendsMap})
        return res.status(200).send({user,friendsMap})

    } catch (error) {
        console.log(error.message);

        return res.status(400).json({
        success: false,
        message: error.message,
        });
    }

}

