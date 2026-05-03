import express from "express";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./db/db.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";

import { initSocket } from "./socket/socket.js";

dotenv.config();

const app = express();
const server = createServer(app);

/* Middleware */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/* Routes */
app.get("/", (req, res) => {
  res.send("working");
});

app.use("/api/auth", authRoutes);

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