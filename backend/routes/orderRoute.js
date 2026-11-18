import express from 'express'
import {
  placeOrder,
  claimGiftOrder,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder
} from '../controllers/orderController.js'

import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { quoteCheckout } from '../controllers/checkoutController.js'

const orderRouter = express.Router()

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)
orderRouter.post('/delete', adminAuth, deleteOrder)

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/quote', quoteCheckout)
orderRouter.post('/claim-gift', authUser, claimGiftOrder)
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter
