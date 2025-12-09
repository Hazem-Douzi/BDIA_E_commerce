import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/product/all"); // Adjust URL as needed
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        await axios.delete(`http://127.0.0.1:8080/api/product/Delete/${productId}`);
        alert("Product deleted successfully");
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting product");
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
                <th className="text-left py-3 px-6">Picture</th>
                <th className="text-left py-3 px-6">Seller</th>
                <th className="text-left py-3 px-6">Name</th>
                <th className="text-left py-3 px-6">Description</th>
                <th className="text-left py-3 px-6">State</th>
                <th className="text-left py-3 px-6">Date</th>
                <th className="text-left py-3 px-6">Price</th>
                <th className="text-left py-3 px-6">Available</th>
                <th className="text-left py-3 px-6">Brand</th>
                <th className="text-left py-3 px-6">Quantity</th>
                <th className="text-left py-3 px-6">Negotiable</th>
                <th className="text-left py-3 px-6">Promo</th>
                <th className="text-left py-3 px-6">Delivered</th>
                <th className="text-left py-3 px-6">Category</th>
                <th className="text-left py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
               
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">
                     {console.log(product)}
                    <img
                      src={product.picture || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded border"
                    />
                  </td>
                  <td className="py-3 px-6 font-semibold text-gray-700">{product.sellerId}</td>
                  <td className="py-3 px-6 font-semibold text-gray-700">{product.name}</td>
                  <td className="py-3 px-6 text-gray-600">{product.description}</td>
                  <td className="py-3 px-6 text-gray-600">{product.state}</td>
                  <td className="py-3 px-6 text-gray-600">{new Date(product.date).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-gray-600">{product.price} TND</td>
                  <td className="py-3 px-6 text-gray-600">{product.available ? "Yes" : "No"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.brand}</td>
                  <td className="py-3 px-6 text-gray-600">{product.quantity}</td>
                  <td className="py-3 px-6 text-gray-600">{product.negociable ? "Yes" : "No"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.promo}%</td>
                  <td className="py-3 px-6 text-gray-600">{product.delivered ? "Yes" : "No"}</td>
                  <td className="py-3 px-6 text-gray-600">{product.category || "N/A"}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="14" className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
