import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function ProductList() {
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      showError("Error fetching products. Please check your authentication.", "Erreur de chargement");
    }
  };

  // Admin button Navigation
  const handle_home_click = () => navigate("/Home_admin");
  const handle_All_Client_Click = () => navigate("/Home_admin/All_client");
  const handle_All_Seller_Click = () => navigate("/Home_admin/All_seller");
  const handle_All_products_Click = () => navigate("/Home_admin/All_prod");
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://127.0.0.1:8080/api/admin/products/${productId}`);
        showSuccess("Product deleted successfully", "Produit supprimé");
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Delete error:", error);
        showError("Error deleting product: " + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div>
      <header className="header">
        <div className="logo">ShopEase</div>
        <nav>
          <ul className="flex gap-6 items-center">
            <li><a onClick={handle_home_click}>Home</a></li>
            <li><a onClick={handle_All_Client_Click}>All Client</a></li>
            <li><a onClick={handle_All_Seller_Click}>All Seller</a></li>
            <li><a onClick={handle_All_products_Click}>All Products</a></li>
            <button onClick={handleLogoutClick} className="login-btn">Logout</button>
          </ul>
        </nav>
      </header>

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Products</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-2xl overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="text-left py-3 px-6">Image</th>
                <th className="text-left py-3 px-6">Name</th>
                <th className="text-left py-3 px-6">Brand</th>
                <th className="text-left py-3 px-6">Price</th>
                <th className="text-left py-3 px-6">Stock</th>
                <th className="text-left py-3 px-6">Rating</th>
                <th className="text-left py-3 px-6">Seller</th>
                <th className="text-left py-3 px-6">Category</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <img
                      src={product.images && product.images[0] ? `http://127.0.0.1:8080${product.images[0].imageURL}` : "/placeholder.jpg"}
                      alt={product.product_name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-700">{product.product_name}</td>
                  <td className="py-3 px-6 text-gray-600">{product.brand || "N/A"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.price ? `${product.price} TND` : "N/A"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.stock || 0}</td>
                  <td className="py-3 px-6 text-gray-600">{product.rating ? product.rating.toFixed(1) : "0.0"} ⭐</td>
                  <td className="py-3 px-6 text-gray-600">{product.seller?.full_name || "N/A"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.subcategory?.SubCategory_name || "N/A"}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteProduct(product.id_product)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
}
