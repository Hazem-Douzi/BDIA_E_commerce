import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  Star, 
  ChevronRight, 
  Package, 
  Edit, 
  Trash2, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Tag,
  Layers,
  Box,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function ProductDetail({ selectedprod, fetchProducts }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal, showSuccess, showError, showConfirm, closeModal } = useModal();
  const [product, setProduct] = useState(selectedprod || null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch categories and set category/subcategory from product data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await axios.get(`http://127.0.0.1:8080/api/category`);
        const categories = Array.isArray(catRes.data) ? catRes.data : [];
        
        if (product) {
          // Find category
          if (product.id_category) {
            const foundCategory = categories.find(c => c.id_category === product.id_category);
            if (foundCategory) {
              setCategory(foundCategory);
              
              // Find subcategory if available
              if (product.id_SubCategory && foundCategory.subcategories) {
                const foundSub = foundCategory.subcategories.find(s => s.id_SubCategory === product.id_SubCategory);
                if (foundSub) {
                  setSubcategory(foundSub);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch category:", error);
      }
    };
    
    if (product) {
      fetchCategories();
    }
  }, [product]);

  useEffect(() => {
    if (!id || (product && product.id_product)) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://127.0.0.1:8080/api/product/${id}`);
        const productData = res.data;
        setProduct(productData);
      } catch (error) {
        console.error("Failed to load product:", error);
        showError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (selectedprod) {
      setProduct(selectedprod);
    }
  }, [selectedprod]);

  const handleDelete = async () => {
    const productId = product?.id_product || id;
    if (!productId) return;

    showConfirm(
      "Êtes-vous sûr de vouloir supprimer ce produit ?",
      "Supprimer le produit",
      async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            showError("Vous devez être connecté pour supprimer un produit");
            return;
          }

          await axios.delete(`http://127.0.0.1:8080/api/product/delete/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          showSuccess("Produit supprimé avec succès !", "Succès", () => {
            if (fetchProducts) fetchProducts();
            navigate("/Home_seller/my_products");
          });
        } catch (error) {
          console.error("Delete error:", error);
          showError(error.response?.data?.message || "Erreur lors de la suppression du produit");
        }
      }
    );
  };

  const handleUpdate = () => {
    const productId = product?.id_product || id;
    navigate(`/Home_seller/Update_product/${productId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(numRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8080/uploads/${imageUrl}`;
  };

  const productImages = product?.images && product.images.length > 0 
    ? product.images.map(img => img.imageURL || img)
    : product?.image ? [product.image] : [];

  const mainImage = productImages.length > 0 
    ? getImageUrl(productImages[selectedImageIndex])
    : getImageUrl(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Produit non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = (product.stock || 0) > 0;
  const productPrice = parseFloat(product.price) || 0;
  const productRating = parseFloat(product.rating) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/Home_seller')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li>
              <button onClick={() => navigate('/Home_seller/my_products')} className="hover:text-indigo-600 transition-colors">
                Mes Produits
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">{product.product_name || 'Détails du produit'}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div>
              {/* Main Image */}
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={mainImage}
                  alt={product.product_name || "Product image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
                  }}
                />
                {/* Availability Badge */}
                {!isAvailable && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    RUPTURE DE STOCK
                  </div>
                )}
                {isAvailable && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    EN STOCK
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-indigo-600 ring-2 ring-indigo-200' 
                          : 'border-gray-200 hover:border-indigo-400'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Vue ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col space-y-6">
              {/* Title and Category */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.product_name || 'Nom du produit'}
                </h1>
                
                {/* Breadcrumb Category/Subcategory */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  {category ? (
                    <>
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {category.category_name}
                      </span>
                      {subcategory && (
                        <>
                          <ChevronRight className="w-4 h-4" />
                          <span className="flex items-center gap-1">
                            <Layers className="w-4 h-4" />
                            {subcategory.SubCategory_name}
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Catégorie non spécifiée</span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(productRating)}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">
                    {productRating.toFixed(1)}/5
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                  <span className="text-4xl font-bold text-indigo-600">
                    {productPrice.toFixed(2)} DH
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.product_description || 'Aucune description disponible pour ce produit.'}
                </p>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Brand */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Tag className="w-4 h-4" />
                    <span className="text-sm font-medium">Marque</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.brand || 'Non spécifiée'}
                  </p>
                </div>

                {/* Stock */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Box className="w-4 h-4" />
                    <span className="text-sm font-medium">Stock</span>
                  </div>
                  <p className={`text-lg font-semibold ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock || 0} unités
                  </p>
                </div>

                {/* Date Added */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Date d'ajout</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(product.createdAtt)}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  Modifier le produit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  Supprimer
                </button>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-500">
                  <p>Dernière modification : {formatDate(product.updatedAt || product.createdAtt)}</p>
                </div>
              </div>
            </div>
          </div>
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
