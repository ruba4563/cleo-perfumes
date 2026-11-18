import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateCheckoutPricing } from './checkoutPricing.js'

const discount = {
  id: 'bundle', name: 'Bundle',
  tiers: [{ quantity: 2, price: 18 }, { quantity: 3, price: 25 },
    { quantity: 4, price: 32 }, { quantity: 5, price: 40 }, { quantity: 6, price: 50 }],
}
const settings = { discountEnabled: true, activeDiscountId: 'bundle', discounts: [discount] }
const perfume = (quantity) => ({ _id: 'p1', price: 75, category: 'Men', size: '100ml', quantity })

for (const [quantity, total] of [[2, 18], [3, 25], [4, 32], [5, 40], [6, 50]]) {
  test(`${quantity} perfumes cost JOD ${total} with free delivery`, () => {
    const result = calculateCheckoutPricing([perfume(quantity)], settings)
    assert.equal(result.total, total)
    assert.equal(result.deliveryFee, 0)
    assert.equal(result.appliedDiscount.quantity, quantity)
  })
}

test('counts units across different perfumes and sizes', () => {
  const result = calculateCheckoutPricing([perfume(1), { ...perfume(2), _id: 'p2' }], settings)
  assert.equal(result.total, 25)
})

test('unmatched quantities pay regular prices and JOD 3 delivery', () => {
  for (const quantity of [1, 7]) {
    const result = calculateCheckoutPricing([perfume(quantity)], settings)
    assert.equal(result.total, quantity * 75 + 3)
    assert.equal(result.appliedDiscount, null)
  }
})

test('disabled or unselected discounts never apply', () => {
  for (const patch of [{ discountEnabled: false }, { activeDiscountId: '' }]) {
    const result = calculateCheckoutPricing([perfume(3)], { ...settings, ...patch })
    assert.equal(result.total, 228)
    assert.equal(result.deliveryFee, 3)
  }
})

test('only the selected discount applies', () => {
  const result = calculateCheckoutPricing([perfume(2)], {
    ...settings, activeDiscountId: 'other',
    discounts: [discount, { id: 'other', name: 'Other', tiers: [{ quantity: 2, price: 16 }] }],
  })
  assert.equal(result.total, 16)
  assert.equal(result.appliedDiscount.id, 'other')
})

test('atomisers retain their own price and do not count as perfumes', () => {
  const atomiser = { _id: 'a1', price: 5, category: ' Atomisers ', size: '5ml', quantity: 1 }
  assert.equal(calculateCheckoutPricing([perfume(2), atomiser], settings).total, 23)
  assert.equal(calculateCheckoutPricing([perfume(1), atomiser], settings).total, 83)
})

test('bundle never increases the perfume price', () => {
  const result = calculateCheckoutPricing([{ ...perfume(2), price: 5 }], settings)
  assert.equal(result.total, 13)
  assert.equal(result.appliedDiscount, null)
})

test('quote changes when admin switches the offer or changes a price', () => {
  const items = [perfume(2)]
  const initial = calculateCheckoutPricing(items, settings).quoteKey
  assert.equal(calculateCheckoutPricing(items, settings).quoteKey, initial)
  assert.notEqual(calculateCheckoutPricing(items, { ...settings, discountEnabled: false }).quoteKey, initial)
  assert.notEqual(calculateCheckoutPricing([{ ...perfume(2), price: 80 }], settings).quoteKey, initial)
})
