import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  stock: {
    type: Number,
    default: 0,
  },
  bestseller: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Number,
    required: true,
  },
  isGiftEligible: {
    type: Boolean,
    default: false,
  },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;