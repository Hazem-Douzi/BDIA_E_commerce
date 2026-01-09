import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package, ChevronRight, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';

export default function Add_product({ fetchProducts }) {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0.0);
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://127.0.0.1:8080/api/category");
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
        if (categoriesData.length === 0) {
          console.warn("No categories found in database.");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        showError("Erreur lors du chargement des catégories. Veuillez réessayer.");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when category changes
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setSubcategoryId("");
      return;
    }
    const selectedCategory = categories.find(
      (cat) => cat.id_category === parseInt(categoryId)
    );
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
    } else {
      setSubcategories([]);
    }
    setSubcategoryId(""); // Reset subcategory when category changes
  }, [categoryId, categories]);

  const handleAddImage = () => {
    if (images.length >= 5) {
      showError("Vous ne pouvez ajouter que 5 images maximum");
      return;
    }
    setImages([...images, ""]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const saveProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Vous devez être connecté pour ajouter un produit");
        return;
      }

      // Validation
      if (!name.trim()) {
        showError("Le nom du produit est requis");
        return;
      }
      if (!categoryId) {
        showError("La catégorie est requise");
        return;
      }
      if (price <= 0) {
        showError("Le prix doit être supérieur à 0");
        return;
      }
      if (quantity < 1) {
        showError("La quantité doit être au moins 1");
        return;
      }

      const productData = {
        product_name: name,
        product_description: description,
        price: parseFloat(price),
        stock: parseInt(quantity),
        brand: brand.trim() || null,
        id_category: parseInt(categoryId),
        id_SubCategory: subcategoryId ? parseInt(subcategoryId) : null,
        images: images.filter(img => img.trim()),
      };

      await axios.post(
        "http://127.0.0.1:8080/api/product/add",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showSuccess("Produit ajouté avec succès !", "Succès", () => {
        if (fetchProducts) fetchProducts();
        navigate("/Home_seller/my_products");
      });
    } catch (error) {
      console.error("Error:", error);
      showError(error.response?.data?.message || "Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/Home_seller')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Ajouter un produit</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Ajouter un nouveau produit</h1>
              <p className="text-indigo-100">Remplissez les informations ci-dessous pour lister votre produit</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du produit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: iPhone 15 Pro Max"
                required
              />
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100">
                    <span className="text-gray-500">Chargement des catégories...</span>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="w-full px-4 py-3 border-2 border-red-300 rounded-lg bg-red-50">
                    <span className="text-red-600 text-sm">
                      Aucune catégorie disponible. Veuillez contacter l'administrateur.
                    </span>
                  </div>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id_category} value={cat.id_category}>
                        {cat.category_name || 'Catégorie sans nom'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sous-catégorie {categoryId && <span className="text-gray-500 text-xs">(optionnel)</span>}
                </label>
                {categoryId && subcategories.length > 0 ? (
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Sélectionner une sous-catégorie</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat.id_SubCategory} value={subcat.id_SubCategory}>
                        {subcat.SubCategory_name || 'Sous-catégorie sans nom'}
                      </option>
                    ))}
                  </select>
                ) : categoryId ? (
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500 italic">
                    Aucune sous-catégorie disponible
                  </div>
                ) : (
                  <div className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-500 italic">
                    Sélectionnez d'abord une catégorie
                  </div>
                )}
              </div>
            </div>

            {/* Brand and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ex: Apple, Samsung..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (DH) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantité en stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez votre produit en détail (caractéristiques, état, etc.)"
                required
              />
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Images du produit {images.length > 0 && <span className="text-gray-500 text-xs">({images.length}/5)</span>}
                </label>
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une image
                  </button>
                )}
              </div>
              
              {images.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-4">Aucune image ajoutée</p>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Ajouter une image
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Image {index + 1}
                        </label>
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="URL de l'image ou chemin (ex: image.jpg)"
                        />
                      </div>
                      {image && (
                        <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                          <img
                            src={image.startsWith('http') ? image : `http://127.0.0.1:8080/uploads/${image}`}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-6"
                        title="Supprimer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <Plus className="w-5 h-5 inline mr-2" />
                      Ajouter une autre image
                    </button>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Vous pouvez ajouter jusqu'à 5 images. La première image sera l'image principale.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/Home_seller/my_products')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Ajouter le produit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
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
