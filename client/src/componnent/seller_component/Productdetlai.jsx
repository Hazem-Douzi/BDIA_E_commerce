import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail({ selectedprod, fetchProducts }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(selectedprod || null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
// --Navigation
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

  const handleDelete = async () => {
    try {
      const productId = product?.id_product || id;
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8080/api/product/delete/${productId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      alert("Product deleted successfully");
    fetchProducts()
    navigate("/Home_seller/my_products")
    } catch (error) {
      console.error("Delete error:", error);
      const message = error?.response?.data?.message || "Error deleting product";
      alert(message);
    }
  };

  const handleUpdate = () => {
    const productId = product?.id_product || id;
    navigate(`/Home_seller/Update_product/${productId}`);
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
                {product.category?.category_name || "Category: N/A"}
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

            <div className="flex gap-4 mt-4">
              <button
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Delete product?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Do you want to delete this product?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
