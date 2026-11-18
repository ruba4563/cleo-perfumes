import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const parseArrayField = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [value];
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      offerPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      isGiftEligible,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    if (images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
          folder: "products",
        });

        return result.secure_url;
      })
    );

    const product = await productModel.create({
      name,
      description,
      price: Number(price),
      offerPrice: Number(offerPrice) || 0,
      category,
      subCategory: parseArrayField(subCategory),
      sizes: parseArrayField(sizes),
      stock: Number(stock) || 0,
      bestseller: bestseller === true || bestseller === "true",
      isGiftEligible:
        isGiftEligible === true || isGiftEligible === "true",
      image: imagesUrl,
      date: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Could not add product",
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("List products error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Remove product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      offerPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      stock,
      isGiftEligible,
    } = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        offerPrice: Number(offerPrice) || 0,
        category,
        subCategory: parseArrayField(subCategory),
        sizes: parseArrayField(sizes),
        stock: Number(stock) || 0,
        bestseller: bestseller === true || bestseller === "true",
        isGiftEligible:
          isGiftEligible === true || isGiftEligible === "true",
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Single product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addProduct,
  listProducts,
  removeProduct,
  updateProduct,
  singleProduct,
};