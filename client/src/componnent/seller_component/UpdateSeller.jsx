import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";







export default function UpdateSeller({selectedSeller}) {
  const navigate = useNavigate();
const [fullName, setFullName] = useState(selectedSeller.fullName );
const [email, setEmail] = useState(selectedSeller.email);
const [age, setAge] = useState(selectedSeller.age );
const [phoneNumber, setPhoneNumber] = useState(selectedSeller.phoneNumber);
const [address, setAddress] = useState(selectedSeller.address );
const [picture, setPicture] = useState(selectedSeller.picture );
const [password, setPassword] = useState("")



  const saveclient = async () => {
    try {
      const data = {
  fullName,
  email,
  age,
  phoneNumber,
  address,
  picture,
};

if (password) data.password = password;

await axios.patch(
  `http://127.0.0.1:8080/api/seller/update/${selectedSeller.id}`,
  data
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
                picture
              </label>
              <input
                type="text"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"

              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                age
              </label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
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
