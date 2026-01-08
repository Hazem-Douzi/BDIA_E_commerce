import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home_seller() {
  const navigate = useNavigate();

  const handleMyProducts = () => navigate("/Home_seller/my_products");
  const handleAddProduct = () => navigate("/Home_seller/add_product");
  const handleProfile = () => navigate("/Home_seller/profile");
  const handleHomeClick = () => {navigate("/Home_seller");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
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

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Seller!
        </h2>
        <p className="text-gray-600 text-lg">
          Manage your products, update your profile, and track your sales right
          from your dashboard.
        </p>

        {/* Summary Cards (optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"    onClick={handleMyProducts}>
            <h3 className="text-lg font-semibold text-gray-800">My Products</h3>
            <p className="text-sm text-gray-500">
              View, update, or delete your listed items.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"   onClick={handleAddProduct}>
            <h3 className="text-lg font-semibold text-gray-800">Add Product</h3>
            <p className="text-sm text-gray-500">
              List a new product for sale.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition" onClick={handleProfile}>
            <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
            <p className="text-sm text-gray-500">
              Edit your seller information.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
