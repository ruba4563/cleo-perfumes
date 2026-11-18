import productModel from '../models/productModel.js'
import siteSettingsModel from '../models/siteSettingsModel.js'
import { calculateCheckoutPricing } from '../utils/checkoutPricing.js'

export async function quoteCheckout(req, res) {
  try {
    const lines = req.body?.items
    if (!Array.isArray(lines) || !lines.length || lines.length > 100) {
      return res.status(400).json({ success: false, message: 'Check your cart items.' })
    }
    const quantities = new Map()
    for (const line of lines) {
      if (typeof line?.productId !== 'string' || !/^[a-f\d]{24}$/i.test(line.productId) ||
          typeof line.size !== 'string' || !Number.isSafeInteger(line.quantity) || line.quantity < 1) {
        return res.status(400).json({ success: false, message: 'Invalid cart item.' })
      }
      const id = line.productId.toLowerCase()
      quantities.set(id, (quantities.get(id) || 0) + line.quantity)
    }
    const products = await productModel.find({ _id: { $in: [...quantities.keys()] } })
    const byId = new Map(products.map((product) => [String(product._id), product]))
    const confirmed = []
    for (const line of lines) {
      const product = byId.get(line.productId.toLowerCase())
      if (!product || product.isGiftEligible || !product.sizes.includes(line.size) ||
          product.stock < quantities.get(String(product._id))) {
        return res.status(400).json({ success: false, message: 'An item or size is unavailable. Review your cart.' })
      }
      confirmed.push({
        _id: product._id, size: line.size, quantity: line.quantity,
        price: product.offerPrice > 0 ? product.offerPrice : product.price,
        category: product.category,
      })
    }
    const settings = await siteSettingsModel.findOne() || new siteSettingsModel()
    res.set('Cache-Control', 'no-store')
    return res.json({ success: true, pricing: calculateCheckoutPricing(confirmed, settings) })
  } catch (error) {
    console.error('Checkout quote failed:', error.message)
    return res.status(500).json({ success: false, message: 'Unable to calculate checkout. Please try again.' })
  }
}
