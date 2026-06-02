import jwt from 'jsonwebtoken'
import User from '../modles/user.js'
import validator from 'validator'
import bcrypt, { compare } from 'bcrypt'
import dotenv from 'dotenv' 
import cookieParser from 'cookie-parser'
import nodemailer from 'nodemailer'

import resetPasswordTemplate from '../template/passwordReset.js'

const salt = Number(process.env.SALT);





export const test = (req,res) => {
    try{
        res.send("working")
    }
    catch{
        console.log('something is wrong ')
    }
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Enter all fields",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Email is invalid",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        status: "failed",
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists",
      });
    }

    // Hash password
    const hashpassword = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      name,
      email,
      password: hashpassword,
    });

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error.message,
    });
  }
};

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

            if(!existingUser) return res.status(400).send("No user found");
 
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
      console.log(data)
        return res.status(200).send({
            message: "logined",
            name: existingUser.name,
            id: existingUser.id.toString()
            
        })
    
    }
    catch(error){
        console.log(error)
    }

}

export const forgotPassword = async (req,res) => {
    try{
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User doesn't exist" });

       console.log(process.env.JWT_SECRET_KEY)
        const secret = process.env.JWT_SECRET_KEY + user.password;
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1h' });
        const resetURL = `http://localhost:5173/reset_password/${user._id}/${token}`;


         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'shivingthakur@gmail.com  ',
                pass: process.env.APP_SECRET,
            },
            });


            const mailOptions = {
            to: email,
            from: 'shivingthakur@gmail.com',
            subject: 'Password Reset Request',
             html: resetPasswordTemplate(resetURL),
        
            };

            await transporter.sendMail(mailOptions);

             res.status(200).json({ message: 'Password reset link sent' });



    }
    catch(error){
        console.error("Error while sending mail:", error);
        res.status(500).json({ message: 'Something went wrong' });
    }

}

export const resetPassword = async (req,res) => {
    try{
     
        const { password ,id,token} = req.body;

         const user = await User.findOne({ _id: id });
        if (!user) {
        return res.status(400).json({ message: "User not exists!" });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;

      
        jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);

          await User.findByIdAndUpdate(id, {
            password: encryptedPassword,
            });

     
        res.status(200).json({ status: "success",message: 'Password has been reset' });


    }
    catch(error){
        console.error("Error while sending mail:", error);
         res.status(500).json({ message: 'Something went wrong' });


         if (error.name === "JsonWebTokenError") {
            return res.status(400).json({
                message: "Invalid token",
            });
            }

            if (error.name === "TokenExpiredError") {
            return res.status(400).json({
                message: "Token expired",
            });
            }

            return res.status(500).json({
            message: "Something went wrong",
            });
       
    }
}


export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};





