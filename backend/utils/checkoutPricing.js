import { createHash } from 'node:crypto'

export function calculateCheckoutPricing(items, settings) {
  let subtotalFils = 0
  let perfumeSubtotalFils = 0
  let perfumeQuantity = 0

  for (const item of items) {
    const priceFils = Math.round(item.price * 1000)
    if (!Number.isSafeInteger(priceFils) || priceFils < 0 ||
        !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
      throw new Error('Invalid catalog price or cart quantity.')
    }
    subtotalFils += priceFils * item.quantity
    if (String(item.category ?? '').trim().toLowerCase() !== 'atomisers') {
      perfumeQuantity += item.quantity
      perfumeSubtotalFils += priceFils * item.quantity
    }
  }

  if (!Number.isSafeInteger(subtotalFils) || !Number.isSafeInteger(subtotalFils + 3000)) {
    throw new Error('Cart total is outside the supported range.')
  }

  const active = settings?.discountEnabled
    ? settings.discounts?.find((discount) => discount.id === settings.activeDiscountId)
    : null
  const tier = active?.tiers?.find((entry) => entry.quantity === perfumeQuantity)
  const bundleFils = tier ? Math.round(tier.price * 1000) : null
  const eligible = tier && Number.isSafeInteger(bundleFils) && bundleFils >= 0 &&
    bundleFils <= perfumeSubtotalFils
  const discountFils = eligible ? perfumeSubtotalFils - bundleFils : 0
  const deliveryFils = eligible ? 0 : 3000

  const pricing = {
    subtotal: subtotalFils / 1000,
    discountAmount: discountFils / 1000,
    deliveryFee: deliveryFils / 1000,
    standardDeliveryFee: 3,
    total: (subtotalFils - discountFils + deliveryFils) / 1000,
    appliedDiscount: eligible ? {
      id: active.id,
      name: active.name,
      quantity: perfumeQuantity,
      bundlePrice: bundleFils / 1000,
    } : null,
  }
  const quoteKey = createHash('sha256').update(JSON.stringify({
    items: items.map((item) => [String(item._id), item.size, item.quantity, item.price, item.category]),
    pricing,
  })).digest('hex')
  return { ...pricing, quoteKey }
}
