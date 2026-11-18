import mongoose from 'mongoose'

export const defaultDiscounts = [{
  id: 'cleo-bundles',
  name: 'Cleo Perfume Bundle',
  tiers: [
    { quantity: 2, price: 18 },
    { quantity: 3, price: 25 },
    { quantity: 4, price: 32 },
    { quantity: 5, price: 40 },
    { quantity: 6, price: 50 },
  ],
}]

const discountSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tiers: [{
    _id: false,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  }],
}, { _id: false })

const siteSettingsSchema = new mongoose.Schema({
  announcementEnabled: {
    type: Boolean,
    default: true,
  },

  announcementMessages: {
    type: [String],
    default: ['توصيل مجاني للطلبات فوق 25 دينار'],
  },

  discountEnabled: {
    type: Boolean,
    default: true,
  },

  discountCodes: {
    type: [String],
    default: ['CLEO20'],
  },
  discounts: { type: [discountSchema], default: () => defaultDiscounts },
  activeDiscountId: { type: String, default: 'cleo-bundles' },
})

const siteSettingsModel =
  mongoose.models.siteSettings ||
  mongoose.model('siteSettings', siteSettingsSchema)

export default siteSettingsModel
