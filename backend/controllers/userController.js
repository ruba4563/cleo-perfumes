import userModel from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const isAllowedEmail = (email) => {
  const allowedDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'icloud.com'
  ]

  if (!validator.isEmail(email)) return false

  const domain = email.split('@')[1].toLowerCase()
  return allowedDomains.includes(domain)
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!isAllowedEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" })
    }

    if (user.authProvider === 'google') {
      return res.json({ success: false, message: 'Please login with Google' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = createToken(user._id)
      return res.json({ success: true, token })
    }

    return res.json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const exists = await userModel.findOne({ email })

    if (exists) {
      return res.json({ success: false, message: 'User already exists' })
    }

    if (!isAllowedEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      authProvider: 'local',
      wishlistData: [],
      rewardPoints: 0,
      freeGiftCredits: 0
    })

    const user = await newUser.save()
    const token = createToken(user._id)

    return res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body

    if (!credential) {
      return res.json({ success: false, message: 'Google credential is required' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()
    const { sub, email, name } = payload

    if (!email) {
      return res.json({ success: false, message: 'Google email not found' })
    }

    let user = await userModel.findOne({ email })

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: '',
        authProvider: 'google',
        googleId: sub,
        wishlistData: [],
        rewardPoints: 0,
        freeGiftCredits: 0
      })
    }

    const token = createToken(user._id)

    return res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: 'Google login failed' })
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      return res.json({ success: true, token })
    }

    return res.json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const getProfile = async (req, res) => {
  try {
    const clerkId = req.auth.userId

    let user = await userModel.findOne({ clerkId }).select('-password')

    if (!user) {
      user = await userModel.create({
        clerkId,
        name: '',
        email: '',
        authProvider: 'clerk',
        cartData: {},
        wishlistData: [],
        rewardPoints: 0,
        freeGiftCredits: 0
      })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const getWishlist = async (req, res) => {
  try {
    const clerkId = req.auth.userId

    let user = await userModel.findOne({ clerkId })

    if (!user) {
      user = await userModel.create({
        clerkId,
        authProvider: 'clerk',
        cartData: {},
        wishlistData: [],
        rewardPoints: 0,
        freeGiftCredits: 0
      })
    }

    res.json({
      success: true,
      wishlistData: user.wishlistData || []
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const toggleWishlist = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { itemId } = req.body

    if (!itemId) {
      return res.json({ success: false, message: 'Product id is required' })
    }

    let user = await userModel.findOne({ clerkId })

    if (!user) {
      user = await userModel.create({
        clerkId,
        authProvider: 'clerk',
        cartData: {},
        wishlistData: [],
        rewardPoints: 0,
        freeGiftCredits: 0
      })
    }

    let wishlistData = user.wishlistData || []

    if (wishlistData.includes(itemId)) {
      wishlistData = wishlistData.filter((id) => id !== itemId)
    } else {
      wishlistData.push(itemId)
    }

    user.wishlistData = wishlistData
    await user.save()

    res.json({
      success: true,
      wishlistData
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  loginUser,
  registerUser,
  adminLogin,
  googleLogin,
  getProfile,
  getWishlist,
  toggleWishlist
}