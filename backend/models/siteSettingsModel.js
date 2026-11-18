import mongoose from 'mongoose'

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
})

const siteSettingsModel =
  mongoose.models.siteSettings ||
  mongoose.model('siteSettings', siteSettingsSchema)

export default siteSettingsModel