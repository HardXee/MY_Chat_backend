import express from 'express'
import authRoutes from './routes/authRoutes.js'
import connectDB from './db/db.js';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

const salt = process.env.SALT;
// handelilng simple get 

app.use(express.json());

app.get('/',(req,res)=>{
    res.send(`working ${salt}`);
})

// use router
app.use("/api/auth",authRoutes)


app.get('/hello',(req,res,next) =>{
    res.send("working");
})

app.listen(3000,() => {
    console.log("server is Running at 3000");
    connectDB()
})






