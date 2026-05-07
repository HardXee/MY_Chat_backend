
import User from '../modles/user.js'
import Request from '../modles/request.js'
import { response } from 'express';
import mongoose from 'mongoose';

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
        

        console.log(request[0].sender)
        res.status(200).send(request)

    }   
    catch(error){
         console.log(error);
         return res.status(400).send("no request found");
    }
}
