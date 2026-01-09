import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Store, Trash2, CheckCircle, XCircle, ChevronRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

export default function SellerList() {
  const { modal, showSuccess, showError, showConfirm, closeModal } = useModal();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(buildApiUrl("/admin/users/sellers"));
      setSellers(res.data || []);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      showError("Erreur lors du chargement des vendeurs. Veuillez vérifier votre authentification.", "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    showConfirm(
      "Êtes-vous sûr de vouloir supprimer ce vendeur ? Cette action est irréversible.",
      "Supprimer le vendeur",
      async () => {
        try {
          await axios.delete(buildApiUrl("/admin/users/${sellerId}"));
          showSuccess("Vendeur supprimé avec succès", "Succès");
          fetchSellers();
        } catch (error) {
          console.error("Delete error:", error);
          showError("Erreur lors de la suppression: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const handleVerifySeller = async (sellerId, status) => {
    try {
      await axios.put(buildApiUrl("/admin/sellers/${sellerId}/verification"), {
        verification_status: status
      });
      showSuccess(`Statut de vérification mis à jour: ${status === 'verified' ? 'Vérifié' : 'Rejeté'}`, "Succès");
      fetchSellers();
    } catch (error) {
      console.error("Verification error:", error);
      showError("Erreur lors de la mise à jour: " + (error.response?.data?.message || error.message));
    }
  };

  const getVerificationStatus = (status) => {
    switch (status) {
      case 'verified':
        return { label: 'Vérifié', class: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'rejected':
        return { label: 'Rejeté', class: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: 'En attente', class: 'bg-yellow-100 text-yellow-800', icon: null };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/Home_admin')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Tous les Vendeurs</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tous les Vendeurs</h1>
              <p className="text-purple-100">Gérez les vendeurs et leurs vérifications</p>
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Chargement des vendeurs...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom Complet</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Boutique</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Vérification</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun vendeur trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    sellers.map((seller, index) => {
                      const statusInfo = getVerificationStatus(seller.seller_profile?.verification_status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <motion.tr
                          key={seller.id_user || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-5 h-5 text-gray-400 mr-2" />
                              <span className="text-sm font-semibold text-gray-900">{seller.id_user}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{seller.full_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{seller.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{seller.phone || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{seller.seller_profile?.shop_name || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                              {StatusIcon && <StatusIcon className="w-3 h-3" />}
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              {seller.seller_profile?.verification_status !== 'verified' && (
                                <button
                                  onClick={() => handleVerifySeller(seller.id_user, 'verified')}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-1"
                                  title="Vérifier"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {seller.seller_profile?.verification_status !== 'rejected' && (
                                <button
                                  onClick={() => handleVerifySeller(seller.id_user, 'rejected')}
                                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteSeller(seller.id_user)}
                                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
