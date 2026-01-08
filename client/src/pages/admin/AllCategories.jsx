import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from "lucide-react";
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function AllCategories() {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
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
      const res = await axios.get("http://127.0.0.1:8080/api/admin/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      showError("Failed to load categories. Please try again.", "Erreur de chargement");
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
    // Clear error for this field
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
      newErrors.category_name = "Category name is required";
    }
    if (!formData.category_description.trim()) {
      newErrors.category_description = "Category description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://127.0.0.1:8080/api/admin/categories", formData);
      showSuccess("Category added successfully!", "Catégorie ajoutée");
      setShowAddModal(false);
      setFormData({ category_name: "", category_description: "", image: "" });
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      showError(err.response?.data?.message || "Failed to add category. Please try again.");
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
        `http://127.0.0.1:8080/api/admin/categories/${editingCategory.id_category}`,
        formData
      );
      showSuccess("Category updated successfully!", "Catégorie mise à jour");
      setShowEditModal(false);
      setEditingCategory(null);
      setFormData({ category_name: "", category_description: "", image: "" });
      setErrors({});
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      showError(err.response?.data?.message || "Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8080/api/admin/categories/${categoryId}`);
      showSuccess("Category deleted successfully!", "Catégorie supprimée");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      showError(err.response?.data?.message || "Failed to delete category. It may be in use by products.");
    }
  };

  const handleHomeClick = () => {
    navigate("/Home_admin");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const resetForm = () => {
    setFormData({ category_name: "", category_description: "", image: "" });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleHomeClick}
                className="text-xl font-bold text-indigo-600 hover:text-indigo-700"
              >
                ShopEase Admin
              </button>
              <nav className="flex gap-4">
                <button
                  onClick={handleHomeClick}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Home
                </button>
                <button className="text-indigo-600 font-semibold">
                  Categories
                </button>
              </nav>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No categories found.</p>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
            >
              Add Your First Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id_category}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {category.image && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.category_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gray-200">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                )}
                {!category.image && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {category.category_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.category_description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id_category)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Add New Category</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.category_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="e.g., Electronics, Clothing"
                  />
                  {errors.category_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="category_description"
                    value={formData.category_description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.category_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="Describe this category..."
                  />
                  {errors.category_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_description}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-xs mt-1">Optional: URL to category image</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateCategory} className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.category_name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="e.g., Electronics, Clothing"
                  />
                  {errors.category_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="category_description"
                    value={formData.category_description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.category_description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-indigo-500"
                    }`}
                    placeholder="Describe this category..."
                  />
                  {errors.category_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.category_description}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-xs mt-1">Optional: URL to category image</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

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