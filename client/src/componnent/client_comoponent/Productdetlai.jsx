import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail({ selectedprod }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(selectedprod || null);
const handleMyProducts = () => navigate("/Home_client/Productlist_client");
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => {navigate("/Home_client");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };
  useEffect(() => {
    if (!id || (product && product.id_product)) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8080/api/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };
    fetchProduct();
  }, [id, product]);

  if (!product) return <div className="text-center mt-10">No product selected.</div>;

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
            src={product.images?.[0]?.imageURL || "/placeholder.jpg"}
            alt={product.product_name || "Product image"}
            className="w-full h-[500px] object-cover rounded-xl border"
          />

          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{product.product_name}</h2>
              <p className="text-lg text-gray-500 mt-1">
                {product.category_name || (product.id_category ? `Category #${product.id_category}` : "Category: N/A")}
              </p>
              <p className="text-md text-gray-600 mt-4">{product.product_description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-md">
              <p><strong>Brand:</strong> {product.brand || "N/A"}</p>
              <p><strong>Price:</strong> ${product.price ?? "0.00"}</p>
              <p><strong>Quantity:</strong> {product.stock ?? 0}</p>
              <p><strong>Rate:</strong> {product.rating ?? 0}/5</p>
              <p><strong>Date Added:</strong> {product.createdAtt ? new Date(product.createdAtt).toLocaleDateString() : "N/A"}</p>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
