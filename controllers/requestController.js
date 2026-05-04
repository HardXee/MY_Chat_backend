
import User from '../modles/user.js'
import Request from '../modles/request.js'

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