import User from '../modles/user.js'

export const searchUser = async (req,res) => {
    try{
        const {email}  = req.body;

        if(email.length == 0){
            return res.status(400).send('email is empty');
        }

        // chekc for the user in the dbl 
        const indb = await User.findOne({email});
        console.log(indb)

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

export const sendRequest = (req,res) =>{
    try{
        // sender _id , receiver.email,
        const {receiver} = req.body;
        const senderId = req.user._id;

        console.log(receiver,senderId)

    }
    catch(error){
        console.log(error)
    }

}