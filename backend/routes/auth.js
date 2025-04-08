import express from 'express'
import {
    signup,
    login,
    logout,
    refreshToken,
    getProfile,
    loginWithGoogle,
    getUser,
    getAllUsers,
    updateProfile
    

} from '../controllers/auth.js'
import { adminRoute, protectRoute } from '../middleware/middleware.js'
const router = express.Router()


router.get('/user/:id', getUser)
router.post('/signup', signup)
router.post('/login', login)
router.post('/login/google', loginWithGoogle) 
router.post('/logout', logout)
router.post('/refresh-token', refreshToken)
router.get('/profile', protectRoute, getProfile)
router.get('/get-all-users', protectRoute, adminRoute, getAllUsers)
router.put("/update-profile", protectRoute, updateProfile)



export default router
