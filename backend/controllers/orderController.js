import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js'
import siteSettingsModel from '../models/siteSettingsModel.js'
import { calculateCheckoutPricing } from '../utils/checkoutPricing.js'

class OrderValidationError extends Error {}

const addressFields = [
  'firstName', 'lastName', 'nearestPlace', 'city', 'state', 'phone',
]

const placeOrder = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { items, address, quoteKey } = req.body ?? {}

    const deliveryAddress = Object.fromEntries(
      addressFields.map((field) => [
        field,
        typeof address?.[field] === 'string' ? address[field].trim() : '',
      ]),
    )

    if (Object.values(deliveryAddress).some((value) => !value)) {
      throw new OrderValidationError('Complete all delivery fields.')
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new OrderValidationError('Your cart is empty.')
    }

    const requestedItems = items.map((item) => {
      const productId = item?.productId ?? item?._id ?? item?.id
      const size = typeof item?.size === 'string' ? item.size.trim() : ''
      const quantity = item?.quantity

      if (
        typeof productId !== 'string' ||
        !/^[a-f0-9]{24}$/i.test(productId) ||
        !size ||
        !Number.isSafeInteger(quantity) ||
        quantity < 1
      ) {
        throw new OrderValidationError('A cart item has an invalid size or quantity.')
      }

      return { productId, size, quantity }
    })

    const orderId = await orderModel.db.transaction(async (session) => {
      const confirmedItems = []
      let unitsOrdered = 0

      for (const { productId, size, quantity } of requestedItems) {
        const product = await productModel.findOneAndUpdate(
          {
            _id: productId,
            sizes: size,
            isGiftEligible: { $ne: true },
            stock: { $gte: quantity },
          },
          { $inc: { stock: -quantity } },
          { session },
        )

        if (!product) {
          throw new OrderValidationError(
            'A perfume or size is unavailable in the requested quantity. Check your cart.',
          )
        }

        const unitPrice = product.offerPrice > 0 ? product.offerPrice : product.price

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
          throw new OrderValidationError(`Check the catalog price for ${product.name}.`)
        }

        unitsOrdered += quantity

        confirmedItems.push({
          _id: product._id,
          name: product.name,
          image: product.image,
          price: unitPrice,
          size,
          quantity,
          category: product.category,
        })
      }

      const settings = await siteSettingsModel.findOne().session(session) || new siteSettingsModel()
      const pricing = calculateCheckoutPricing(confirmedItems, settings)
      if (quoteKey !== pricing.quoteKey) {
        throw new OrderValidationError('Your checkout price changed. Review the refreshed total and place the order again.')
      }

      const order = new orderModel({
        userId: clerkId,
        items: confirmedItems,
        address: deliveryAddress,
        amount: pricing.total,
        pricing,
        paymentMethod: 'COD',
        payment: false,
        status: 'Order Placed',
        date: Date.now(),
        pointsEarned: unitsOrdered,
      })

      await order.save({ session })

      await userModel.updateOne(
        { clerkId },
        { $set: { cartData: {} }, $setOnInsert: { authProvider: 'clerk' } },
        { upsert: true, session },
      )

      return order._id
    })

    return res.status(201).json({ success: true, message: 'Order Placed', orderId })
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return res.status(400).json({ success: false, message: error.message })
    }

    console.error('Order placement failed:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to place the order right now.',
    })
  }
}

const claimGiftOrder = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const { productId } = req.body ?? {}

    if (typeof productId !== 'string' || !/^[a-f\d]{24}$/i.test(productId)) {
      throw new OrderValidationError('Invalid gift product')
    }

    const orderId = await orderModel.db.transaction(async (session) => {
      const previousOrder = await orderModel.findOne({
  userId: clerkId,
  isGiftOrder: { $ne: true },
})
  .sort({ date: -1, _id: -1 })
  .session(session)

const giftAddress = Object.fromEntries(
  addressFields.map((field) => [
    field,
    String(previousOrder?.address?.[field] ?? '').trim(),
  ]),
)

if (addressFields.some((field) => !giftAddress[field])) {
  throw new OrderValidationError(
    'Please complete a regular order with delivery details before claiming a gift.',
  )
}
      const user = await userModel.findOneAndUpdate(
        { clerkId, freeGiftCredits: { $gte: 1 } },
        { $inc: { freeGiftCredits: -1 } },
        { session },
      )

      if (!user) {
        throw new OrderValidationError('You do not have any free gift credits')
      }

      const giftProduct = await productModel.findOneAndUpdate(
        {
          _id: productId,
          isGiftEligible: true,
          stock: { $gte: 1 },
        },
        { $inc: { stock: -1 } },
        { session },
      )

      if (!giftProduct) {
        throw new OrderValidationError('This gift is no longer available')
      }

      const newOrder = new orderModel({
        userId: clerkId,
        items: [{
          _id: giftProduct._id,
          name: giftProduct.name,
          description: giftProduct.description,
          price: 0,
          offerPrice: 0,
          quantity: 1,
          image: giftProduct.image,
          category: giftProduct.category,
          subCategory: giftProduct.subCategory,
          size: giftProduct.sizes?.[0] || 'Gift',
          isFreeGift: true,
        }],
        address: giftAddress,
        amount: 0,
        paymentMethod: 'FREE_GIFT',
        payment: true,
        status: 'Order Placed',
        date: Date.now(),
        pointsEarned: 0,
        giftCreditsEarned: 0,
        rewardApplied: true,
        isGiftOrder: true,
      })

      await newOrder.save({ session })
      return newOrder._id
    })

    return res.status(201).json({
      success: true,
      message: 'Free gift order placed successfully',
      orderId,
    })
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }

    console.error(error.message)
    return res.status(500).json({
      success: false,
      message: 'Unable to claim the gift right now.',
    })
  }
}

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const userOrders = async (req, res) => {
  try {
    const clerkId = req.auth.userId
    const orders = await orderModel.find({ userId: clerkId })
    res.json({ success: true, orders })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body

    const order = await orderModel.findById(orderId)

    if (!order) {
      return res.json({
        success: false,
        message: 'Order not found'
      })
    }

    order.status = status

    if (
      status === 'Delivered' &&
      !order.rewardApplied &&
      !order.isGiftOrder
    ) {
      const perfumesBought = order.items
        .filter((item) => !item.isFreeGift)
        .reduce((total, item) => {
          return total + (Number(item.quantity) || 1)
        }, 0)

      const user = await userModel.findOne({ clerkId: order.userId })

      if (user) {
        const oldPoints = user.rewardPoints || 0
        const oldGiftCredits = user.freeGiftCredits || 0

        const totalPoints = oldPoints + perfumesBought
        const earnedGiftCredits = Math.floor(totalPoints / 9)
        const remainingPoints = totalPoints % 9

        await userModel.findOneAndUpdate(
          { clerkId: order.userId },
          {
            rewardPoints: remainingPoints,
            freeGiftCredits: oldGiftCredits + earnedGiftCredits
          }
        )

        order.pointsEarned = perfumesBought
        order.giftCreditsEarned = earnedGiftCredits
        order.rewardApplied = true
      }
    }

    await order.save()

    res.json({
      success: true,
      message:
        status === 'Delivered'
          ? 'Status Updated and rewards applied if eligible'
          : 'Status Updated'
    })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body

    await orderModel.findByIdAndDelete(orderId)

    res.json({ success: true, message: 'Order Deleted' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  placeOrder,
  claimGiftOrder,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder
}
