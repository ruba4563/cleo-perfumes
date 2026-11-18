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
    } = req.body;

    let settings = await siteSettingsModel.findOne();

    if (!settings) {
      settings = new siteSettingsModel();
    }

    settings.announcementEnabled = announcementEnabled;
    settings.announcementMessages = announcementMessages;
    settings.discountEnabled = discountEnabled;

    settings.discountCodes = (discountCodes || [])
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