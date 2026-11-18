import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/siteSettingsController.js";
import adminAuth from '../middleware/adminAuth.js'

const siteSettingsRouter = express.Router();

siteSettingsRouter.get("/", getSettings);
siteSettingsRouter.post("/update", adminAuth, updateSettings);
export default siteSettingsRouter;