import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingCart, Star, ChevronRight, Trash2, Package } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Fetch wishlist from backend
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        setLoading(false);
        setError('Vous devez être connecté pour voir votre liste de souhaits');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://127.0.0.1:8080/api/wishlist/');
        console.log('Wishlist API response:', response.data);
        const wishlistData = Array.isArray(response.data) ? response.data : [];
        console.log('Processed wishlist data:', wishlistData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        console.error('Error details:', error.response?.data);
        setError(error.response?.data?.message || 'Erreur lors du chargement de la liste de souhaits');
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Vous devez être connecté', 'Connexion requise');
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.delete(`http://127.0.0.1:8080/api/wishlist/${productId}`);
      
      // Update local state
      const updatedWishlist = wishlist.filter(item => {
        const itemId = item.id || item.id_product;
        return itemId !== productId;
      });
      setWishlist(updatedWishlist);
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showError(error.response?.data?.message || 'Erreur lors de la suppression de la liste de souhaits');
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Vous devez être connecté pour ajouter au panier', 'Connexion requise', () => {
        navigate('/login');
      });
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.post('http://127.0.0.1:8080/api/cart/add', {
        id_product: product.id_product || product.id,
        quantity: 1
      });
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      showSuccess(`${product.product_name || product.name} a été ajouté au panier!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError(error.response?.data?.message || 'Erreur lors de l\'ajout au panier');
    }
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Liste de souhaits</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                Ma Liste de Souhaits
              </h1>
              <p className="text-gray-600">
                {wishlist.length === 0 
                  ? 'Aucun produit dans votre liste de souhaits'
                  : `${wishlist.length} ${wishlist.length === 1 ? 'produit' : 'produits'} sauvegardé${wishlist.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de votre liste de souhaits...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl shadow-md p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                const fetchWishlist = async () => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    navigate('/login');
                    return;
                  }
                  try {
                    setLoading(true);
                    setError(null);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.get('http://127.0.0.1:8080/api/wishlist/');
                    setWishlist(Array.isArray(response.data) ? response.data : []);
                  } catch (err) {
                    setError(err.response?.data?.message || 'Erreur lors du chargement');
                  } finally {
                    setLoading(false);
                  }
                };
                fetchWishlist();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Wishlist Products */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre liste de souhaits est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits que vous souhaitez acheter plus tard</p>
            <button
              onClick={() => navigate('/Home_client/Productlist_client')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
            >
              Parcourir les produits
            </button>
          </div>
        )}

        {/* Wishlist Products Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => {
              const productId = product.id_product || product.id;
              const productName = product.product_name || product.name || 'Produit sans nom';
              const productPrice = parseFloat(product.price) || 0;
              
              // Get image from various possible locations
              let productImage = null;
              // First check if images array exists and has items
              if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                productImage = product.images[0].imageURL || product.images[0].image || null;
              }
              // Fallback to other possible locations
              if (!productImage) {
                if (product.image) {
                  productImage = product.image;
                } else if (product.imageURL) {
                  productImage = product.imageURL;
                }
              }
              
              // Use default image if none found
              if (!productImage) {
                productImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
              }
              
              // Construct full URL if it's a relative path
              if (productImage && !productImage.startsWith('http') && !productImage.startsWith('/uploads')) {
                productImage = `http://127.0.0.1:8080/uploads/${productImage}`;
              } else if (productImage && productImage.startsWith('/uploads')) {
                productImage = `http://127.0.0.1:8080${productImage}`;
              }
              
              const productDescription = product.product_description || product.description || '';
              const isAvailable = (product.stock || 0) > 0;
              
              console.log(`Product ${index}:`, { productId, productName, productImage, hasImages: !!product.images, images: product.images });

              return (
                <div
                  key={productId}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden group">
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(productId)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                      title="Retirer de la liste de souhaits"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">En rupture de stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg line-clamp-2 min-h-[3rem]">
                      {productName}
                    </h3>
                    {productDescription && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {productDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500 ml-1">
                        ({(parseFloat(product.rating) || 0).toFixed(1)})
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-4">
                      {productPrice.toFixed(2)} DH
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!isAvailable}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                          isAvailable
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter au panier
                      </button>
                      <button
                        onClick={() => navigate(`/Productlist/ProductDetlail/${productId}`)}
                        className="px-4 py-2 rounded-lg font-semibold transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
                      >
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
};

export default WishlistPage;
