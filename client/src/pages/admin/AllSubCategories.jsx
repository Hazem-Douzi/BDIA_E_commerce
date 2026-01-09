import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Plus, Edit, Trash2, ChevronRight, ChevronLeft, FolderTree, Save, X, Filter } from "lucide-react";
import { motion } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

export default function AllSubCategories() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('category');
  const { modal, showSuccess, showError, showConfirm, closeModal } = useModal();
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(categoryIdParam || 'all');
  const [formData, setFormData] = useState({
    SubCategory_name: "",
    id_category: categoryIdParam || "",
    SubCategory_description: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    if (categoryIdParam) {
      setSelectedCategoryFilter(categoryIdParam);
      setFormData(prev => ({ ...prev, id_category: categoryIdParam }));
    }
  }, [categoryIdParam]);

  useEffect(() => {
    fetchSubcategories();
  }, [selectedCategoryFilter]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(buildApiUrl("/admin/categories"));
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(buildApiUrl("/admin/subcategories"));
      let allSubcategories = res.data || [];
      
      // Filter by category if a category is selected
      if (selectedCategoryFilter && selectedCategoryFilter !== 'all') {
        allSubcategories = allSubcategories.filter(
          sub => sub.id_category === parseInt(selectedCategoryFilter)
        );
      }
      
      setSubcategories(allSubcategories);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      showError("Erreur lors du chargement des sous-catégories. Veuillez réessayer.", "Erreur de chargement");
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
    if (!formData.SubCategory_name.trim()) {
      newErrors.SubCategory_name = "Le nom de la sous-catégorie est requis";
    }
    if (!formData.id_category || formData.id_category === '') {
      newErrors.id_category = "La catégorie parente est requise";
    }
    if (!formData.SubCategory_description.trim()) {
      newErrors.SubCategory_description = "La description de la sous-catégorie est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(buildApiUrl("/admin/subcategories"), {
        ...formData,
        id_category: parseInt(formData.id_category)
      });
      showSuccess("Sous-catégorie ajoutée avec succès !", "Succès");
      setShowAddModal(false);
      setFormData({ SubCategory_name: "", id_category: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : "", SubCategory_description: "" });
      setErrors({});
      fetchSubcategories();
    } catch (err) {
      console.error("Error adding subcategory:", err);
      showError(err.response?.data?.message || "Erreur lors de l'ajout de la sous-catégorie. Veuillez réessayer.");
    }
  };

  const handleEditClick = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      SubCategory_name: subcategory.SubCategory_name || "",
      id_category: subcategory.id_category?.toString() || "",
      SubCategory_description: subcategory.SubCategory_description || ""
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleUpdateSubcategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(
        buildApiUrl("/admin/subcategories/${editingSubcategory.id_SubCategory}"),
        {
          ...formData,
          id_category: parseInt(formData.id_category)
        }
      );
      showSuccess("Sous-catégorie mise à jour avec succès !", "Succès");
      setShowEditModal(false);
      setEditingSubcategory(null);
      setFormData({ SubCategory_name: "", id_category: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : "", SubCategory_description: "" });
      setErrors({});
      fetchSubcategories();
    } catch (err) {
      console.error("Error updating subcategory:", err);
      showError(err.response?.data?.message || "Erreur lors de la mise à jour de la sous-catégorie. Veuillez réessayer.");
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    showConfirm(
      "Êtes-vous sûr de vouloir supprimer cette sous-catégorie ? Cette action est irréversible.",
      "Supprimer la sous-catégorie",
      async () => {
        try {
          await axios.delete(buildApiUrl("/admin/subcategories/${subcategoryId}"));
          showSuccess("Sous-catégorie supprimée avec succès !", "Succès");
          fetchSubcategories();
        } catch (err) {
          console.error("Error deleting subcategory:", err);
          showError(err.response?.data?.message || "Erreur lors de la suppression. La sous-catégorie peut être utilisée par des produits.");
        }
      }
    );
  };

  const resetForm = () => {
    setFormData({ SubCategory_name: "", id_category: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : "", SubCategory_description: "" });
    setErrors({});
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id_category === parseInt(categoryId));
    return category?.category_name || "Catégorie inconnue";
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
            <li>
              <button onClick={() => navigate('/Home_admin/All_categories')} className="hover:text-indigo-600 transition-colors">
                Catégories
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Sous-catégories</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FolderTree className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Gestion des Sous-catégories</h1>
                <p className="text-purple-100">Ajoutez, modifiez ou supprimez les sous-catégories de produits</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter une Sous-catégorie
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-semibold text-gray-700">Filtrer par catégorie :</label>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => {
                setSelectedCategoryFilter(e.target.value);
                setFormData(prev => ({ ...prev, id_category: e.target.value !== 'all' ? e.target.value : "" }));
              }}
              className="flex-1 max-w-xs px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id_category} value={category.id_category}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subcategories Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Chargement des sous-catégories...</p>
          </div>
        ) : subcategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">Aucune sous-catégorie trouvée</p>
            <p className="text-gray-500 mb-6">
              {selectedCategoryFilter === 'all' 
                ? "Commencez par ajouter votre première sous-catégorie"
                : `Aucune sous-catégorie pour "${getCategoryName(selectedCategoryFilter)}"`
              }
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Ajouter une Sous-catégorie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.id_SubCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Subcategory Header */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4">
                  <div className="flex items-center justify-between">
                    <FolderTree className="w-8 h-8 text-purple-600" />
                    <span className="px-3 py-1 bg-white/80 text-purple-600 rounded-full text-xs font-semibold">
                      {getCategoryName(subcategory.id_category)}
                    </span>
                  </div>
                </div>

                {/* Subcategory Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {subcategory.SubCategory_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[3.75rem]">
                    {subcategory.SubCategory_description || "Aucune description disponible"}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(subcategory)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteSubcategory(subcategory.id_SubCategory)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Subcategory Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Ajouter une Sous-catégorie</h2>
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
              <form onSubmit={handleAddSubcategory} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie Parente <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="id_category"
                    value={formData.id_category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.id_category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id_category} value={category.id_category}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {errors.id_category && (
                    <p className="text-red-500 text-sm mt-1">{errors.id_category}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Sous-catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SubCategory_name"
                    value={formData.SubCategory_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.SubCategory_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Ex: Smartphones, T-shirts..."
                  />
                  {errors.SubCategory_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.SubCategory_name}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="SubCategory_description"
                    value={formData.SubCategory_description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.SubCategory_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Décrivez cette sous-catégorie..."
                  />
                  {errors.SubCategory_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.SubCategory_description}</p>
                  )}
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
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Subcategory Modal */}
        {showEditModal && editingSubcategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">Modifier la Sous-catégorie</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSubcategory(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateSubcategory} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie Parente <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="id_category"
                    value={formData.id_category}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.id_category
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id_category} value={category.id_category}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {errors.id_category && (
                    <p className="text-red-500 text-sm mt-1">{errors.id_category}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom de la Sous-catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SubCategory_name"
                    value={formData.SubCategory_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.SubCategory_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Ex: Smartphones, T-shirts..."
                  />
                  {errors.SubCategory_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.SubCategory_name}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="SubCategory_description"
                    value={formData.SubCategory_description}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.SubCategory_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Décrivez cette sous-catégorie..."
                  />
                  {errors.SubCategory_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.SubCategory_description}</p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSubcategory(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
