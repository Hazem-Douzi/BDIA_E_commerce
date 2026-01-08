import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Admin button Navigation
  const handle_All_Client_Click = () => {
    navigate("/Home_admin/All_client");
  };
  const handle_All_Seller_Click = () => {
    navigate("/Home_admin/All_seller");
  };
  const handle_All_products_Click = () => {
    navigate("/Home_admin/All_prod");
  };
  const handle_All_Categories_Click = () => {
    navigate("/Home_admin/All_categories");
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };
  const handle_home_click = () => {
    navigate("/Home_admin");
  };
  
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">ShopEase</div>
        <nav>
          <ul>
            <li>
              <a onClick={handle_home_click}>Home</a>
            </li>
            <li>
              <a onClick={handle_All_Client_Click}>All Client</a>
            </li>
            <li>
              <a onClick={handle_All_Seller_Click}>All Seller</a>
            </li>
            <li>
              <a onClick={handle_All_products_Click}>All products</a>
            </li>
            <li>
              <a onClick={handle_All_Categories_Click}>Categories</a>
            </li>
            <button onClick={handleLogoutClick} className="login-btn">
              Logout
            </button>
          </ul>
        </nav>
      </header>
      <main className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            Welcome to your Dashboard!
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            As an admin, you can manage{" "}
            <span className="font-semibold text-blue-600">clients</span>,{" "}
            <span className="font-semibold text-blue-600">sellers</span>, and{" "}
            <span className="font-semibold text-blue-600">products</span>. Use
            the navigation above to access each section.
          </p>

          {/* Stats Cards */}
          {stats && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-indigo-600">{stats.total_users}</h3>
                <p className="text-sm text-gray-500 mt-2">Total Users</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-green-600">{stats.total_clients}</h3>
                <p className="text-sm text-gray-500 mt-2">Total Clients</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-purple-600">{stats.total_sellers}</h3>
                <p className="text-sm text-gray-500 mt-2">Total Sellers</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-orange-600">{stats.total_products}</h3>
                <p className="text-sm text-gray-500 mt-2">Total Products</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-blue-600">{stats.total_orders}</h3>
                <p className="text-sm text-gray-500 mt-2">Total Orders</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-yellow-600">{stats.pending_orders}</h3>
                <p className="text-sm text-gray-500 mt-2">Pending Orders</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-pink-600">{stats.total_categories}</h3>
                <p className="text-sm text-gray-500 mt-2">Categories</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-red-600">{stats.pending_seller_verifications}</h3>
                <p className="text-sm text-gray-500 mt-2">Pending Verifications</p>
              </div>
            </div>
          )}

          {/* Action Cards */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={handle_All_Client_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Clients
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                View and manage registered clients.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={handle_All_Seller_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Sellers
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Manage seller profiles and verification.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={handle_All_products_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                All Products
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Approve, edit, or delete products.
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={handle_All_Categories_Click}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                Categories
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Add, edit, or delete product categories.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
