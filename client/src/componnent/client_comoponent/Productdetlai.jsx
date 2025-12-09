import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetail({ selectedprod }) {
  const navigate = useNavigate();
const handleMyProducts = () => navigate("/Productlist");
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => {navigate("/Home_client");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };
  if (!selectedprod) return <div className="text-center mt-10">No product selected.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
       {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">ShopEase Client</div>
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

      {/* Product Detail */}
      <div className="max-w-6xl mx-auto my-12 p-8 bg-white shadow-2xl rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img
            src={selectedprod.image || "/placeholder.jpg"}
            alt={selectedprod.name}
            className="w-full h-[500px] object-cover rounded-xl border"
          />

          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{selectedprod.name}</h2>
              <p className="text-lg text-gray-500 mt-1">{selectedprod.category}</p>
              <p className="text-md text-gray-600 mt-4">{selectedprod.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-md">
              <p><strong>Brand:</strong> {selectedprod.brand || "N/A"}</p>
              <p><strong>State:</strong> {selectedprod.state}</p>
              <p><strong>Price:</strong> ${selectedprod.price}</p>
              <p><strong>Quantity:</strong> {selectedprod.quantity}</p>
              <p><strong>Promo:</strong> {selectedprod.promo}%</p>
              <p><strong>Available:</strong> {selectedprod.available ? "Yes" : "No"}</p>
              <p><strong>Negotiable:</strong> {selectedprod.negociable ? "Yes" : "No"}</p>
              <p><strong>Delivered:</strong> {selectedprod.delivered ? "Yes" : "No"}</p>
              <p><strong>Rate:</strong> {selectedprod.rate}/5</p>
              <p><strong>Date Added:</strong> {new Date(selectedprod.date).toLocaleDateString()}</p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
