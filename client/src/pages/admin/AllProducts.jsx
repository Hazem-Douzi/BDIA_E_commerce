import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Package, Trash2, Star, ChevronRight, Eye, MessageCircle, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';

export default function ProductList() {
  const { modal, showSuccess, showError, showConfirm, closeModal } = useModal();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productReviews, setProductReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState({});
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
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8080/api/admin/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      showError("Erreur lors du chargement des produits. Veuillez vérifier votre authentification.", "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    showConfirm(
      "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
      "Supprimer le produit",
      async () => {
        try {
          await axios.delete(`http://127.0.0.1:8080/api/admin/products/${productId}`);
          showSuccess("Produit supprimé avec succès", "Succès");
          fetchProducts();
        } catch (error) {
          console.error("Delete error:", error);
          showError("Erreur lors de la suppression: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const fetchProductReviews = async (productId) => {
    if (productReviews[productId]) return; // Already loaded

    try {
      setLoadingReviews(prev => ({ ...prev, [productId]: true }));
      const res = await axios.get(`http://127.0.0.1:8080/api/review/product/${productId}`);
      setProductReviews(prev => ({ ...prev, [productId]: res.data || [] }));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setProductReviews(prev => ({ ...prev, [productId]: [] }));
    } finally {
      setLoadingReviews(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleToggleReviews = (productId) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
      fetchProductReviews(productId);
    }
  };

  const handleDeleteReview = async (reviewId, productId) => {
    showConfirm(
      "Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.",
      "Supprimer le commentaire",
      async () => {
        try {
          await axios.delete(`http://127.0.0.1:8080/api/admin/reviews/${reviewId}`);
          showSuccess("Commentaire supprimé avec succès", "Succès");
          // Refresh reviews for this product
          const res = await axios.get(`http://127.0.0.1:8080/api/review/product/${productId}`);
          setProductReviews(prev => ({ ...prev, [productId]: res.data || [] }));
          // Refresh products to update ratings
          fetchProducts();
        } catch (error) {
          console.error("Delete review error:", error);
          showError("Erreur lors de la suppression: " + (error.response?.data?.message || error.message));
        }
      }
    );
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8080/uploads/${imageUrl}`;
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(numRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
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
            <li className="text-gray-900 font-medium">Tous les Produits</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Tous les Produits</h1>
              <p className="text-indigo-100">Gérez tous les produits de la plateforme</p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Marque</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Note</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Vendeur</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    products.map((product, index) => (
                      <>
                        <motion.tr
                          key={product.id_product || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-indigo-50 transition-colors"
                        >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={getImageUrl(product.images?.[0]?.imageURL || product.image)}
                            alt={product.product_name}
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{product.product_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{product.brand || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">{product.price ? `${parseFloat(product.price).toFixed(2)} DH` : "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            (product.stock || 0) > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {renderStars(product.rating || 0)}
                            <span className="text-sm text-gray-600 ml-1">({(product.rating || 0).toFixed(1)})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{product.seller?.full_name || product.seller?.username || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {product.subcategory?.SubCategory_name || product.category?.category_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleReviews(product.id_product)}
                              className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-1"
                              title="Voir les commentaires"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {expandedProduct === product.id_product ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id_product)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                      {/* Reviews Section */}
                      <AnimatePresence>
                        {expandedProduct === product.id_product && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan="9" className="px-6 py-4 bg-gray-50">
                              <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                  <MessageCircle className="w-5 h-5 text-purple-600" />
                                  Commentaires ({productReviews[product.id_product]?.length || 0})
                                </h4>
                                {loadingReviews[product.id_product] ? (
                                  <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                                    <p className="mt-2 text-gray-600 text-sm">Chargement des commentaires...</p>
                                  </div>
                                ) : productReviews[product.id_product]?.length > 0 ? (
                                  <div className="space-y-4">
                                    {productReviews[product.id_product].map((review, idx) => (
                                      <motion.div
                                        key={review.id_review || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                              <div className="flex items-center gap-2">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <span className="font-semibold text-gray-900">
                                                  {review.client?.full_name || review.client?.username || 'Client inconnu'}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1">
                                                {renderStars(review.rating_review || 0)}
                                                <span className="text-sm text-gray-600 ml-1">
                                                  ({review.rating_review || 0}/5)
                                                </span>
                                              </div>
                                              <span className="text-xs text-gray-500">
                                                {review.review_createdAt 
                                                  ? new Date(review.review_createdAt).toLocaleDateString('fr-FR')
                                                  : 'N/A'}
                                              </span>
                                            </div>
                                            {review.commentt && (
                                              <p className="text-gray-700 text-sm pl-7">
                                                {review.commentt}
                                              </p>
                                            )}
                                          </div>
                                          <button
                                            onClick={() => handleDeleteReview(review.id_review, product.id_product)}
                                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Supprimer le commentaire"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p>Aucun commentaire pour ce produit</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                      </>
                    ))
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
