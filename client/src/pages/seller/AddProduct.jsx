import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function Add_product({fetchProducts}) {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState(0.0);
  const [available, setAvailable] = useState(true);
  const [brand, setBrand] = useState("");
  const [rate, setRate] = useState(0.0);
  const [quantity, setQuantity] = useState(1);
  const [negociable, setNegociable] = useState(false);
  const [promo, setPromo] = useState(0.0);
  const [delivered, setDelivered] = useState(false);
  const [image, setimage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://127.0.0.1:8080/api/category");
        // The API returns an array of categories with id_category and category_name
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
        if (categoriesData.length === 0) {
          console.warn("No categories found in database. Please contact admin to add categories.");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        showError("Failed to load categories. Please refresh the page or contact support.", "Erreur de chargement");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8080/api/product/add",
        {
          product_name: name,
          product_description: description,
          price,
          stock: quantity,
          rating: rate,
          brand,
          id_category: categoryId ? parseInt(categoryId, 10) : null,
          images: image ? [image] : [],
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );



      showSuccess("Product and image added successfully!", "Produit ajouté", () => {
        if (fetchProducts) fetchProducts();
        navigate("/Home_seller/my_products");
      });
    } catch (error) {
      console.error("Error:", error.message);
      showError(error.response?.data?.message || "Erreur lors de l'ajout du produit");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct();
    fetchProducts()
    navigate("/Home_seller/my_products")

  };
// Navigation
  const handleMyProducts = () => navigate("/Home_seller/my_products");
  const handleAddProduct = () => navigate("/Home_seller/add_product");
  const handleProfile = () => navigate("/Home_seller/profile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/Home_seller");
  };

  return (
    <div>
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">ShopEase Seller</div>
        <nav className="space-x-4">
          <button
            onClick={handleHomeClick}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Home
          </button>
          <button
            onClick={handleMyProducts}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            My Products
          </button>
          <button
            onClick={handleAddProduct}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Add Product
          </button>
          <button
            onClick={handleProfile}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              {loadingCategories ? (
                <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="mt-1 block w-full border border-red-300 rounded-md shadow-sm p-2 bg-red-50">
                  <span className="text-red-600 text-sm">
                    No categories available. Please contact admin to add categories.
                  </span>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id_category} value={cat.id_category}>
                      {cat.category_name || 'Unnamed Category'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product image
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setimage(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    State
  </label>
  <select
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  >
    <option value="">Select product condition</option>
    <option value="new">New</option>
    <option value="used">Used</option>
  </select>
</div>


            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date.toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
           <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setimage(Array.from(e.target.files))}
  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>

            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
                <span>Available</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={delivered}
                  onChange={(e) => setDelivered(e.target.checked)}
                />
                <span>Delivered</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={negociable}
                  onChange={(e) => setNegociable(e.target.checked)}
                />
                <span>Negotiable</span>
              </label>

              {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={makeOffer}
                  onChange={(e) => setMakeOffer(e.target.checked)}
                  disabled={!negociable}
                />
                <span>Make Offer</span>
              </label> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Rate
  </label>
  <input
    type="number"
    min="1"
    max="5"
    step="1"
    value={rate}
    onChange={(e) => setRate(parseFloat(e.target.value))}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  />
</div>

            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Promo (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={promo}
                  onChange={(e) => setPromo(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
