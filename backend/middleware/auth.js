import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

const authUser = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY,

  onError: (error, req, res) => {
    console.log('CLERK ERROR MESSAGE:', error.message)
    console.log('AUTH HEADER:', req.headers.authorization)

    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    })
  }
})

export default authUser