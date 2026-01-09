import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Package,
  PlusCircle,
  User,
  BarChart3,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Eye,
  Star,
  LogOut,
  Home as HomeIcon,
  Store
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

export default function Home_seller() {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [sellerInfo, setSellerInfo] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    fetchSellerProfile();
    fetchSellerStats();
  }, []);

  const fetchSellerProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(buildApiUrl("/seller/profile"), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSellerInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch seller profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const fetchSellerStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(buildApiUrl("/seller/stats"), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        const revenue = parseFloat(response.data.total_revenue) || 0;
        console.log('Seller Stats API Response:', response.data);
        console.log('Calculated total_revenue:', revenue);
        setStats({
          totalProducts: parseInt(response.data.total_products) || 0,
          totalOrders: parseInt(response.data.total_orders) || 0,
          totalRevenue: revenue,
          averageRating: parseFloat(response.data.average_rating) || 0,
          totalViews: parseInt(response.data.total_views) || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch seller stats:', error);
      // Stats endpoint might not exist yet, use default values
    } finally {
      setLoading(false);
    }
  };

  const handleMyProducts = () => navigate("/Home_seller/my_products");
  const handleAddProduct = () => navigate("/Home_seller/add_product");
  const handleProfile = () => navigate("/Home_seller/profile");
  const handleOrders = () => navigate("/Home_seller/orders");
  const handleHomeClick = () => { navigate("/Home_seller"); };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  // Recalculate statCards whenever stats changes
  const statCards = useMemo(() => [
    {
      title: "Produits Totaux",
      value: stats.totalProducts || 0,
      icon: Package,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      onClick: handleMyProducts
    },
    {
      title: "Commandes",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      title: "Revenus Totaux",
      value: `${(stats.totalRevenue || 0).toFixed(2)} DH`,
      icon: DollarSign,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      title: "Note Moyenne",
      value: stats.averageRating && parseFloat(stats.averageRating) > 0 
        ? parseFloat(stats.averageRating).toFixed(1) 
        : "N/A",
      icon: Star,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600"
    }
  ], [stats, handleMyProducts]);

  const actionCards = [
    {
      title: "Mes Produits",
      description: "Voir, modifier ou supprimer vos produits listés",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      onClick: handleMyProducts
    },
    {
      title: "Mes Commandes",
      description: "Voir et gérer les commandes reçues",
      icon: ShoppingBag,
      color: "from-orange-500 to-orange-600",
      onClick: handleOrders
    },
    {
      title: "Ajouter un Produit",
      description: "Lister un nouveau produit en vente",
      icon: PlusCircle,
      color: "from-green-500 to-green-600",
      onClick: handleAddProduct
    },
    {
      title: "Mon Profil",
      description: "Modifier vos informations de vendeur",
      icon: User,
      color: "from-purple-500 to-purple-600",
      onClick: handleProfile
    }
  ];

  const shopName = sellerInfo?.shop_name || user?.username || "Votre Boutique";
  const sellerName = user?.username || sellerInfo?.full_name || "Vendeur";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bienvenue, {sellerName} !
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              Gérez vos produits, suivez vos ventes et développez votre boutique en ligne.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddProduct}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                <PlusCircle className="w-5 h-5 inline-block mr-2" />
                Ajouter un Produit
              </button>
              <button
                onClick={handleMyProducts}
                className="bg-indigo-600/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600/30 transition-all transform hover:scale-105"
              >
                Voir Mes Produits
              </button>
            </div>
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Statistics Cards */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Statistiques</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={card.onClick}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer ${card.onClick ? '' : ''}`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${card.color} ${card.hoverColor} p-3 rounded-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
                      <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={card.onClick}
                  className="group cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all h-full`}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-white/90 text-lg">{card.description}</p>
                    <div className="mt-6 flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                      Commencer
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Tips Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Conseils pour Vendre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Optimisez vos ventes</h3>
              <p className="text-gray-600">
                Ajoutez des descriptions détaillées et des images de qualité pour attirer plus de clients.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Suivez vos performances</h3>
              <p className="text-gray-600">
                Consultez régulièrement vos statistiques pour comprendre ce qui fonctionne le mieux.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <Star className="w-8 h-8 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Maintenez votre réputation</h3>
              <p className="text-gray-600">
                Répondez rapidement aux commentaires et maintenez une communication claire avec vos clients.
              </p>
            </div>
          </div>
        </div>
      </section>

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
