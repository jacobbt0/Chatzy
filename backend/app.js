import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from "path";

import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'

dotenv.config();

import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'
const PORT = process.env.PORT || 8888

const __dirname = path.resolve();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,  // Allow sending cookies
    })
)
app.use(express.json({ limit: '3mb' })); 
app.use(express.urlencoded({ extended: true, limit: '3mb' }));
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
    console.log('listening on port', PORT)
    connectDB()
})