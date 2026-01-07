import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";







export default function UpdateSeller({selectedSeller}) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(selectedSeller?.full_name || "");
  const [email, setEmail] = useState(selectedSeller?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(selectedSeller?.phone || "");
  const [address, setAddress] = useState(selectedSeller?.adress || "");
  const [shopName, setShopName] = useState(selectedSeller?.seller_profile?.shop_name || "");
  const [shopDescription, setShopDescription] = useState(selectedSeller?.seller_profile?.shop_description || "");
  const [password, setPassword] = useState("");



  const saveclient = async () => {
    try {
      const data = {
        full_name: fullName,
        email,
        phone: phoneNumber,
        adress: address,
        shop_name: shopName,
        shop_description: shopDescription,
      };

if (password) data.password = password;

await axios.put(
  `http://127.0.0.1:8080/api/seller/profile`,
  data,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  }
);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    saveclient();
    alert("profile updated successfully!");
    navigate("/Home_seller/profile")

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
            Modify Seller information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                seller  FullName
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop name
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shop description
              </label>
              <input
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
                        <div>
              <label className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
                        <div>
              <label className="block text-sm font-medium text-gray-700">
                phoneNumber
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
