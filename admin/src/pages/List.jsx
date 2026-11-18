import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editOfferPrice, setEditOfferPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCategory, setEditCategory] = useState("Men");
  const [editSubCategory, setEditSubCategory] = useState([]);
  const [editSizes, setEditSizes] = useState([]);
  const [editBestseller, setEditBestseller] = useState(false);
  const [editGiftEligible, setEditGiftEligible] = useState(false);

  const fragranceTypes = [
    "Oud",
    "Musk",
    "Amber",
    "Woody",
    "Fresh",
    "Citrus",
    "Floral",
    "Sweet",
    "Vanilla",
    "Oriental",
    "Spicy",
    "Leather",
    "Fruity",
    "Powdery",
    "Aquatic",
    "Green",
    "Smoky",
  ];

  const sizeOptions = ["5ml", "10ml", "50ml", "60ml", "75ml", "100ml", "120ml"];

  const normalizeArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }

    return [];
  };

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openEdit = (item) => {
    setEditingProduct(item);
    setEditName(item.name || "");
    setEditDescription(item.description || "");
    setEditPrice(item.price || "");
    setEditOfferPrice(item.offerPrice || "");
    setEditStock(item.stock || 0);
    setEditCategory(item.category || "Men");
    setEditSubCategory(normalizeArray(item.subCategory));
    setEditSizes(normalizeArray(item.sizes));
    setEditBestseller(item.bestseller || false);
    setEditGiftEligible(item.isGiftEligible || false);
  };

  const closeEdit = () => {
    setEditingProduct(null);
  };

  const toggleEditSubCategory = (type) => {
    setEditSubCategory((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  const toggleEditSize = (size) => {
    setEditSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    if (editSubCategory.length === 0) {
      toast.error("Please select at least one fragrance note");
      return;
    }

    if (editSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/product/update",
        {
          id: editingProduct._id,
          name: editName,
          description: editDescription,
          price: editPrice,
          offerPrice: editOfferPrice,
          stock: editStock,
          category: editCategory,
          subCategory: JSON.stringify(editSubCategory),
          sizes: JSON.stringify(editSizes),
          bestseller: editBestseller,
          isGiftEligible: editGiftEligible,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        closeEdit();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_2fr_1fr_1fr_1fr_1fr] items-center py-1 px-2">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Notes</b>
          <b>Price</b>
          <b>Offer</b>
          <b>Stock</b>
          <b className="text-center">Action</b>
        </div>

        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_1fr_2fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img className="w-12" src={item.image?.[0]} alt="" />

            <p>{item.name}</p>

            <p>{item.category}</p>

            <p className="text-xs text-gray-500">
              {normalizeArray(item.subCategory).join(", ")}
            </p>

            <p>${item.price}</p>

            <p>{item.offerPrice > 0 ? `$${item.offerPrice}` : "-"}</p>

            <p className={item.stock > 0 ? "text-green-600" : "text-red-600"}>
              {item.stock > 0 ? item.stock : "Out"}
            </p>

            <div className="flex justify-center gap-3">
              <p
                onClick={() => openEdit(item)}
                className="cursor-pointer text-blue-600"
              >
                Edit
              </p>

              <p
                onClick={() => removeProduct(item._id)}
                className="cursor-pointer text-red-500"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={updateProduct}
            className="bg-white w-[90%] max-w-[760px] max-h-[90vh] overflow-y-auto p-6 rounded flex flex-col gap-3"
          >
            <h2 className="text-xl font-semibold mb-2">Edit Product</h2>

            <div>
              <p className="mb-1">Name</p>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border px-3 py-2"
                required
              />
            </div>

            <div>
              <p className="mb-1">Description</p>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="mb-1">Price</p>
                <input
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full border px-3 py-2"
                  type="number"
                  required
                />
              </div>

              <div>
                <p className="mb-1">Offer Price</p>
                <input
                  value={editOfferPrice}
                  onChange={(e) => setEditOfferPrice(e.target.value)}
                  className="w-full border px-3 py-2"
                  type="number"
                  placeholder="0"
                />
              </div>

              <div>
                <p className="mb-1">Stock</p>
                <input
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full border px-3 py-2"
                  type="number"
                  required
                />
              </div>
            </div>

            <div>
              <p className="mb-1">Category</p>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full border px-3 py-2"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Atomisers">Atomisers</option>
              </select>
            </div>

            <div>
              <p className="mb-1">Fragrance Notes</p>

              <div className="flex flex-wrap gap-2">
                {fragranceTypes.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleEditSubCategory(type)}
                    className={`px-4 py-2 rounded-full cursor-pointer text-sm transition-all ${
                      editSubCategory.includes(type)
                        ? "bg-black text-white"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1">Product Size</p>

              <div className="flex gap-3 flex-wrap">
                {sizeOptions.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleEditSize(size)}
                    className={`px-4 py-2 cursor-pointer rounded transition-all ${
                      editSizes.includes(size)
                        ? "bg-black text-white"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                checked={editBestseller}
                onChange={() => setEditBestseller((prev) => !prev)}
                type="checkbox"
                id="editBestseller"
              />

              <label htmlFor="editBestseller" className="cursor-pointer">
                Bestseller
              </label>
            </div>

            <div className="flex gap-2 mt-1">
              <input
                checked={editGiftEligible}
                onChange={() => setEditGiftEligible((prev) => !prev)}
                type="checkbox"
                id="editGiftEligible"
              />

              <label htmlFor="editGiftEligible" className="cursor-pointer">
                Gift eligible product
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeEdit}
                className="px-5 py-2 border"
              >
                Cancel
              </button>

              <button type="submit" className="px-5 py-2 bg-black text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default List;