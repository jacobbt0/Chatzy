import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import messageRoutes from './routes/message.js'

dotenv.config();

import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'
const PORT = process.env.PORT || 8888
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

server.listen(PORT, () => {
    console.log('listening on port', PORT)
    connectDB()
})