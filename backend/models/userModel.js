import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, unique: true, sparse: true },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    authProvider: { type: String, default: 'clerk' },
    googleId: { type: String, default: '' },
    cartData: { type: Object, default: {} },
    wishlistData: { type: Array, default: [] },

    rewardPoints: { type: Number, default: 0 },
    freeGiftCredits: { type: Number, default: 0 }
  },
  { minimize: false }
)

const userModel =
  mongoose.models.user || mongoose.model('user', userSchema)

export default userModel