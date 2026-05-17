import Message from '../modles/messageModel.js'


export const getMyMessages= async(req,res) => {
    try{
       const {id} = req.params
        
       const mymessages = await Message.find({
        roomId: id
       })

       if(!mymessages){
        return res.status(400).send("no message")
       }
      // console.log(mymessages)
       return res.status(200).send(mymessages)
    }
    catch(error){
        console.log(error)
    }


}