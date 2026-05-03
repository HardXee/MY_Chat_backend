import express from "express";
import authRoutes from "./routes/authRoutes.js";
import requstRoutes from './routes/requestRoutes.js'
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";

import cookieParser from "cookie-parser";
import auth from "./middleware/authmiddleware.js";


import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());
/* Middleware */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


/* Routes */
app.get("/", (req, res) => {
  res.send("working");
});

app.use("/api/auth", authRoutes);
app.use('/api/request',auth,requstRoutes)

app.get("/hello", (req, res) => {
  res.send("working");
});

/* Start Server */
const startServer = async () => {
  try {
    await connectDB();

    initSocket(server);

    server.listen(3000, () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (error) {
    console.log("Server failed to start:", error);
  }
};

startServer();