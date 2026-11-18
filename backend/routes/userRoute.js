import express from 'express'
import authUser from '../middleware/auth.js'

import {
  loginUser,
  registerUser,
  adminLogin,
  googleLogin,
  getProfile,
  getWishlist,
  toggleWishlist
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/google', googleLogin)
userRouter.post('/admin', adminLogin)

userRouter.post('/profile', authUser, getProfile)

userRouter.post('/wishlist/get', authUser, getWishlist)
userRouter.post('/wishlist/toggle', authUser, toggleWishlist)

export default userRouter