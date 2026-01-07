import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Users, ShoppingBag, Layers, ShieldCheck, LogOut, Home, UserCheck, Store, Package, ShoppingCart, Clock, TrendingUp, Shield } from "lucide-react";

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

  const handle_All_Client_Click = () => {
    navigate("/Home_admin/All_client");
  };
  const handle_All_Seller_Click = () => {
    navigate("/Home_admin/All_seller");
  };
  const handle_All_products_Click = () => {
    navigate("/Home_admin/All_prod");
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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-slate-900">ShopEase</div>
              <nav className="hidden md:flex space-x-1">
                <button
                  onClick={handle_home_click}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
                <button
                  onClick={handle_All_Client_Click}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Clients</span>
                </button>
                <button
                  onClick={handle_All_Seller_Click}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  <Store className="w-4 h-4" />
                  <span>Sellers</span>
                </button>
                <button
                  onClick={handle_All_products_Click}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </button>
              </nav>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Admin</h1>
          <p className="text-slate-600">Monitor and manage your e-commerce platform</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_users}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Users className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_clients}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Sellers</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_sellers}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Store className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total_products}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_orders}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending Orders</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pending_orders}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Categories</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total_categories}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Layers className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Pending Verifications</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pending_seller_verifications}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={handle_All_Client_Click}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                  <UserCheck className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Manage Clients</h3>
                  <p className="text-sm text-slate-600">View and manage all registered clients</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={handle_All_Seller_Click}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                  <Store className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Manage Sellers</h3>
                  <p className="text-sm text-slate-600">Handle seller profiles and verifications</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={handle_All_products_Click}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                  <Package className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Manage Products</h3>
                  <p className="text-sm text-slate-600">Approve, edit, or remove products</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
