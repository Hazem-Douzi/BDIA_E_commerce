import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Users,
  UserCheck,
  Store,
  Package,
  ShoppingBag,
  Clock,
  FolderTree,
  AlertCircle,
  PlusCircle,
  Edit3,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Star,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function AdminHome() {
  const navigate = useNavigate();
  const { modal, showError, closeModal } = useModal();
  const [stats, setStats] = useState({
    total_users: 0,
    total_clients: 0,
    total_sellers: 0,
    total_products: 0,
    total_orders: 0,
    pending_orders: 0,
    total_categories: 0,
    pending_seller_verifications: 0
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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get("http://127.0.0.1:8080/api/admin/stats");
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        showError("Vous devez être connecté pour accéder au tableau de bord", "Accès refusé", () => {
          navigate('/login');
        });
      } else {
        showError("Erreur lors du chargement des statistiques");
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleAllClients = () => navigate("/Home_admin/All_client");
  const handleAllSellers = () => navigate("/Home_admin/All_seller");
  const handleAllProducts = () => navigate("/Home_admin/All_prod");
  const handleAllCategories = () => navigate("/Home_admin/All_categories");
  const handleHomeClick = () => navigate("/Home_admin");

  // Stat cards with icons
  const statCards = useMemo(() => [
    {
      title: "Total Utilisateurs",
      value: stats.total_users || 0,
      icon: Users,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600"
    },
    {
      title: "Total Clients",
      value: stats.total_clients || 0,
      icon: UserCheck,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      title: "Total Vendeurs",
      value: stats.total_sellers || 0,
      icon: Store,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      title: "Total Produits",
      value: stats.total_products || 0,
      icon: Package,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    },
    {
      title: "Total Commandes",
      value: stats.total_orders || 0,
      icon: ShoppingBag,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      title: "Commandes en Attente",
      value: stats.pending_orders || 0,
      icon: Clock,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600"
    },
    {
      title: "Catégories",
      value: stats.total_categories || 0,
      icon: FolderTree,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600"
    },
    {
      title: "Vérifications en Attente",
      value: stats.pending_seller_verifications || 0,
      icon: AlertCircle,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600"
    }
  ], [stats]);

  const actionCards = [
    {
      title: "Tous les Clients",
      description: "Voir et gérer tous les clients enregistrés",
      icon: UserCheck,
      color: "from-blue-500 to-blue-600",
      onClick: handleAllClients
    },
    {
      title: "Tous les Vendeurs",
      description: "Gérer les profils des vendeurs et leurs vérifications",
      icon: Store,
      color: "from-purple-500 to-purple-600",
      onClick: handleAllSellers
    },
    {
      title: "Tous les Produits",
      description: "Approuver, modifier ou supprimer les produits",
      icon: Package,
      color: "from-green-500 to-green-600",
      onClick: handleAllProducts
    },
    {
      title: "Catégories",
      description: "Ajouter, modifier ou supprimer les catégories de produits",
      icon: FolderTree,
      color: "from-orange-500 to-red-600",
      onClick: handleAllCategories
    }
  ];

  const adminName = user?.username || user?.full_name || "Administrateur";

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
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Bienvenue, {adminName} !
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-200 mb-6">
              Gérez votre plateforme e-commerce, supervisez les utilisateurs et les produits depuis un seul endroit.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAllClients}
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                <UserCheck className="w-5 h-5 inline-block mr-2" />
                Gérer les Clients
              </button>
              <button
                onClick={handleAllProducts}
                className="bg-indigo-600/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-600/30 transition-all transform hover:scale-105"
              >
                Gérer les Produits
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Statistiques de la Plateforme</h2>
            {stats.pending_orders > 0 || stats.pending_seller_verifications > 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                <AlertCircle className="w-5 h-5" />
                Action requise
              </div>
            ) : null}
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Chargement des statistiques...</p>
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
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`${card.color} ${card.hoverColor} p-3 rounded-lg transition-colors`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {(card.title === "Commandes en Attente" || card.title === "Vérifications en Attente") && card.value > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                            {card.value}
                          </span>
                        )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <p className="text-white/90 text-base mb-4">{card.description}</p>
                    <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                      Accéder
                      <ChevronRight className="w-5 h-5 ml-2" />
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
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Conseils pour l'Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Surveillez les statistiques</h3>
              <p className="text-gray-600">
                Consultez régulièrement les statistiques de la plateforme pour identifier les tendances et les problèmes potentiels.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <ShieldCheck className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Vérifiez les vendeurs</h3>
              <p className="text-gray-600">
                Traitez rapidement les demandes de vérification des vendeurs pour maintenir la qualité de la plateforme.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Optimisez la performance</h3>
              <p className="text-gray-600">
                Organisez les catégories de produits de manière logique pour améliorer l'expérience utilisateur.
              </p>
            </motion.div>
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
