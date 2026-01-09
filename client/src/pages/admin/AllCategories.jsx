import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Edit, Trash2, ChevronRight, Image as ImageIcon, FolderTree, Save, X } from "lucide-react";
import { motion } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

export default function AllCategories() {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, showConfirm, closeModal } = useModal();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    category_name: "",
    category_description: "",
    image: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(buildApiUrl("/admin/categories"));
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showError("Erreur lors du chargement des catégories. Veuillez réessayer.", "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_name.trim()) {
      newErrors.category_name = "Le nom de la catégorie est requis";
    }
    if (!formData.category_description.trim()) {
      newErrors.category_description = "La description de la catégorie est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(buildApiUrl("/admin/categories"), formData);
      showSuccess("Catégorie ajoutée avec succès !", "Succès");
      setShowAddModal(false);
      setFormData({ category_name: "", category_description: "", image: "" });
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      showError(err.response?.data?.message || "Erreur lors de l'ajout de la catégorie. Veuillez réessayer.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setFormData({
      category_name: category.category_name || "",
      category_description: category.category_description || "",
      image: category.image || ""
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(
        buildApiUrl("/admin/categories/${editingCategory.id_category}"),
        formData
      );
      showSuccess("Catégorie mise à jour avec succès !", "Succès");
      setShowEditModal(false);
      setEditingCategory(null);
      setFormData({ category_name: "", category_description: "", image: "" });
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      showError(err.response?.data?.message || "Erreur lors de la mise à jour de la catégorie. Veuillez réessayer.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    showConfirm(
      "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.",
      "Supprimer la catégorie",
      async () => {
        try {
          await axios.delete(buildApiUrl("/admin/categories/${categoryId}"));
          showSuccess("Catégorie supprimée avec succès !", "Succès");
          fetchCategories();
        } catch (err) {
          console.error("Error deleting category:", err);
          showError(err.response?.data?.message || "Erreur lors de la suppression. La catégorie peut être utilisée par des produits.");
        }
      }
    );
  };

  const resetForm = () => {
    setFormData({ category_name: "", category_description: "", image: "" });
    setErrors({});
  };

  const handleManageSubcategories = (category) => {
    navigate(`/Home_admin/All_subcategories?category=${category.id_category}`);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return buildUploadUrl("${imageUrl}");
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
            <li className="text-gray-900 font-medium">Gestion des Catégories</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FolderTree className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion des Catégories</h1>
                <p className="text-indigo-100">Ajoutez, modifiez ou supprimez les catégories de produits</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une Catégorie
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Chargement des catégories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucune catégorie trouvée</p>
            <p className="text-gray-500 mb-6">Commencez par ajouter votre première catégorie</p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Ajouter une Catégorie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id_category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Category Image */}
                {getImageUrl(category.image) ? (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.category_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                      <FolderTree className="w-16 h-16 text-indigo-400" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <FolderTree className="w-16 h-16 text-indigo-400" />
                  </div>
                )}

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {category.category_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                    {category.category_description || "Aucune description disponible"}
                  </p>
                  
                  {/* Subcategories count */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-indigo-600">
                    <FolderTree className="w-4 h-4" />
                    <span>
                      {category.subcategories?.length || 0} sous-catégorie{(category.subcategories?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleManageSubcategories(category)}
                      className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FolderTree className="w-4 h-4" />
                      Gérer les Sous-catégories
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id_category)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Ajouter une Catégorie</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.category_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Ex: Électronique, Vêtements..."
                  />
                  {errors.category_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="category_description"
                    value={formData.category_description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.category_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Décrivez cette catégorie..."
                  />
                  {errors.category_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_description}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL de l'Image
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-xs mt-1">Optionnel : URL de l'image de la catégorie</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Modifier la Catégorie</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateCategory} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.category_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Ex: Électronique, Vêtements..."
                  />
                  {errors.category_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="category_description"
                    value={formData.category_description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.category_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="Décrivez cette catégorie..."
                  />
                  {errors.category_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_description}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL de l'Image
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-xs mt-1">Optionnel : URL de l'image de la catégorie</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
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
