import jwt from 'jsonwebtoken'
import User from '../modles/user.js'
import validator from 'validator'
import bcrypt, { compare } from 'bcrypt'
import dotenv from 'dotenv' 
import cookieParser from 'cookie-parser'

const salt = Number(process.env.SALT);

export const test = (req,res) => {
    try{
        res.send("working")
    }
    catch{
        console.log('something is wrong ')
    }
}

export const register = async(req,res) => {
    try{
        const {name,email,password} =  req.body;

        if(name.length == 0 || email.length == 0 || password == 0){
            return res.status(400).send('Enter all fields')  
        }
      

        if(validator.isEmail(email) == false){
            return  res.status(400).send("email is invalild")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        }

        // check for existing user 
        const existingUser = await User.findOne({ email })

        if(existingUser) return res.status(400).json({ 
            status: "failed",
            message: "user already exists" });

        // hash the password 
        const hashpassword = await bcrypt.hash(password,salt);

        // create new user 
        const newUser = await User.create({
            'name' : name,
            'email' : email,
            'password' : hashpassword
        })
        

        res.status(201).send({
            status: 'success',
            message: "user registerd successfully"
        })
    
    }
    catch(error){
        console.log(console.error())
        return res.status(400).send({
            'status' : "failes",
            'error' : error
        })

        
    }


}


export const login = async(req,res) => {        

    try{
        const {email,password} =  req.body;

        if(email.length == 0 || password == 0){
            return res.status(400).send(' email or password ')  
        }
      

        if(validator.isEmail(email) == false){
            return  res.status(400).send("email is invalild")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        }
    
        // check for existing user 
        const existingUser = await User.findOne({ email })

        if(!existingUser) return res.status(400).send("user or password wrong");
 
        // compare the password  using the entered password and the password stored in db 
        const compare = await bcrypt.compare(password,existingUser.password);

        if(compare == false){
         return   res.status(400).send("user or password wrong")
        }


        // Generating jwt 
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userID: existingUser.id.toString()
        }

        const token = jwt.sign(data,jwtSecretKey);
        console.log(existingUser)
        res.cookie("token", token, {
            httpOnly: false ,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).send({
            message: "logined",
            name: existingUser.name
            
        })
    
    }
    catch(error){
        console.log(console.error())
    }

}












