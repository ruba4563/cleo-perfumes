import userModel from '../models/userModel.js'

const getOrCreateUser = async (clerkId) => {
  let user = await userModel.findOne({ clerkId })

  if (!user) {
    user = await userModel.create({
      clerkId,
      name: '',
      email: '',
      authProvider: 'clerk',
      cartData: {}
    })
  }

  return user
}

const addToCart = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { itemId, size } = req.body

    const userData = await getOrCreateUser(userId)
    const cartData = structuredClone(userData.cartData || {})

    if (cartData[itemId]) {
      cartData[itemId][size] = cartData[itemId][size]
        ? cartData[itemId][size] + 1
        : 1
    } else {
      cartData[itemId] = {}
      cartData[itemId][size] = 1
    }

    await userModel.findOneAndUpdate({ clerkId: userId }, { cartData })

    res.json({ success: true, message: 'Added To Cart', cartData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateCart = async (req, res) => {
  try {
    const userId = req.auth.userId
    const { itemId, size, quantity } = req.body

    const userData = await getOrCreateUser(userId)
    const cartData = structuredClone(userData.cartData || {})

    if (!cartData[itemId]) cartData[itemId] = {}

    if (quantity <= 0) {
      delete cartData[itemId][size]
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]
      }
    } else {
      cartData[itemId][size] = quantity
    }

    await userModel.findOneAndUpdate({ clerkId: userId }, { cartData })

    res.json({ success: true, message: 'Cart Updated', cartData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const getUserCart = async (req, res) => {
  try {
    const userId = req.auth.userId
    const userData = await getOrCreateUser(userId)

    res.json({
      success: true,
      cartData: userData.cartData || {}
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export { addToCart, updateCart, getUserCart }