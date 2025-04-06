import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from './routes/auth.js'

dotenv.config();

import { connectDB } from './lib/db.js'
const app = express()
const PORT = process.env.PORT || 8888
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,  // Allow sending cookies
    })
)
app.use(express.json())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log('listening on port', PORT)
    connectDB()
})