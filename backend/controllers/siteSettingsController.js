import siteSettingsModel from "../models/siteSettingsModel.js";

const getSettings = async (req, res) => {
  try {
    let settings = await siteSettingsModel.findOne();

    if (!settings) {
      settings = await siteSettingsModel.create({
        announcementEnabled: true,
        announcementMessages: ["توصيل مجاني للطلبات فوق 25 دينار"],
        discountEnabled: true,
        discountCodes: ["CLEO20"],
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    const {
      announcementEnabled,
      announcementMessages,
      discountEnabled,
      discountCodes,
      discounts,
      activeDiscountId,
    } = req.body;

    if (typeof announcementEnabled !== 'boolean' || typeof discountEnabled !== 'boolean' ||
        !Array.isArray(announcementMessages) || announcementMessages.length > 3 ||
        announcementMessages.some((message) => typeof message !== 'string' || message.length > 500) ||
        !Array.isArray(discounts) || discounts.length > 20 || typeof activeDiscountId !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid marketing settings.' });
    }
    const ids = new Set();
    for (const discount of discounts) {
      if (typeof discount?.id !== 'string' || !discount.id.trim() || discount.id.length > 100 ||
          ids.has(discount.id) || typeof discount.name !== 'string' || !discount.name.trim() ||
          discount.name.length > 100 || !Array.isArray(discount.tiers) ||
          !discount.tiers.length || discount.tiers.length > 30) {
        return res.status(400).json({ success: false, message: 'Give each discount a unique ID, name, and price tiers.' });
      }
      ids.add(discount.id);
      const quantities = new Set();
      for (const tier of discount.tiers) {
        if (!Number.isSafeInteger(tier?.quantity) || tier.quantity < 1 || quantities.has(tier.quantity) ||
            typeof tier.price !== 'number' || !Number.isFinite(tier.price) || tier.price < 0 ||
            !Number.isSafeInteger(Math.round(tier.price * 1000))) {
          return res.status(400).json({ success: false, message: 'Use unique positive quantities and valid JOD prices.' });
        }
        quantities.add(tier.quantity);
      }
    }
    if (activeDiscountId && !ids.has(activeDiscountId)) {
      return res.status(400).json({ success: false, message: 'Select an existing active discount.' });
    }

    let settings = await siteSettingsModel.findOne();

    if (!settings) {
      settings = new siteSettingsModel();
    }

    settings.announcementEnabled = announcementEnabled;
    settings.announcementMessages = announcementMessages;
    settings.discountEnabled = discountEnabled;
    settings.discounts = discounts;
    settings.activeDiscountId = activeDiscountId;

    settings.discountCodes = (Array.isArray(discountCodes) ? discountCodes : settings.discountCodes || [])
      .filter((code) => typeof code === 'string')
      .filter((code) => code.trim() !== "")
      .map((code) => code.trim().toUpperCase());

    await settings.save();

    res.json({
      success: true,
      message: "Settings Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getSettings, updateSettings };
