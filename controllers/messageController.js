import Message from '../modles/messageModel.js'


export const getMyMessages= async(req,res) => {
    try{
       const {id} = req.params
       const {updatedAt} = req.params
    
       console.log(updatedAt)
    
       const mymessages = await Message.find({
            roomId: id,

            createdAt: {
                $lt: new Date(updatedAt),
            }
            
        })
        .sort({ createdAt: -1 })
        .limit(8);
        


       if(mymessages === 0){
        return res.status(400).send("no message")
       }

       console.log(mymessages.reverse())
       return res.status(200).send(mymessages)
    }
    catch(error){
        console.log(error)
    }


}