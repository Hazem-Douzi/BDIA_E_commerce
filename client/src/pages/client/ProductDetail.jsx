import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Star, ChevronRight, ShoppingCart, Heart, Package, MessageCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function ProductDetail({ selectedprod }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal, showSuccess, showError, showWarning, closeModal } = useModal();
  const [product, setProduct] = useState(selectedprod || null);
  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [userReview, setUserReview] = useState(null); // Existing review by current user
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load wishlist from backend (cart is now loaded in Navbar)
  useEffect(() => {
    // Fetch wishlist from backend
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://127.0.0.1:8080/api/wishlist/');
        setWishlist(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        setWishlist([]);
      }
    };

    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      if (selectedprod && selectedprod.id_product) {
        setProduct(selectedprod);
        if (selectedprod.id_SubCategory) {
          fetchSubcategory(selectedprod.id_SubCategory);
        }
        fetchProductReviews(selectedprod.id_product || selectedprod.id);
        return;
      }
      
      setLoading(true);
      try {
        const res = await axios.get(`http://127.0.0.1:8080/api/product/${id}`);
        const productData = res.data;
        setProduct(productData);
        
        // Fetch subcategory if available
        if (productData.id_SubCategory) {
          fetchSubcategory(productData.id_SubCategory);
        }
        
        // Fetch reviews
        if (productData.id_product || productData.id) {
          fetchProductReviews(productData.id_product || productData.id);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, selectedprod]);

  const fetchSubcategory = async (subcategoryId) => {
    try {
      const categoriesRes = await axios.get("http://127.0.0.1:8080/api/category");
      const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];
      
      for (const cat of categories) {
        if (cat.subcategories) {
          const subcat = cat.subcategories.find(s => s.id_SubCategory === subcategoryId);
          if (subcat) {
            setSubcategory(subcat);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to load subcategory:", error);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const res = await axios.get(`http://127.0.0.1:8080/api/review/product/${productId}`);
      const reviewsData = Array.isArray(res.data) ? res.data : [];
      setReviews(reviewsData);
      
      // Check if current user has a review
      if (user && user.id) {
        const existingReview = reviewsData.find(r => r.id_client === user.id || r.client?.id === user.id || r.client?.id_user === user.id);
        if (existingReview) {
          setUserReview(existingReview);
          setReviewRating(existingReview.rating_review || 0);
          setReviewComment(existingReview.commentt || '');
        }
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating_review || 0), 0);
    return sum / reviews.length;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      showError('Vous devez être connecté pour laisser un avis', 'Connexion requise', () => {
        navigate('/login');
      });
      return;
    }

    if (!reviewRating || reviewRating < 1) {
      showWarning('Veuillez sélectionner une note', 'Note requise');
      return;
    }

    if (!product) return;
    const productId = product.id_product || product.id;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      if (userReview) {
        // Update existing review
        await axios.put(`http://127.0.0.1:8080/api/review/${userReview.id_review}`, {
          rating_review: reviewRating,
          commentt: reviewComment
        });
        showSuccess('Votre avis a été mis à jour');
      } else {
        // Create new review - use correct endpoint: /api/review/product/{product_id}
        await axios.post(`http://127.0.0.1:8080/api/review/product/${productId}`, {
          rating_review: reviewRating,
          commentt: reviewComment
        });
        showSuccess('Votre avis a été ajouté');
      }

      // Refresh reviews and product
      await fetchProductReviews(productId);
      
      // Refresh product to get updated rating
      const productRes = await axios.get(`http://127.0.0.1:8080/api/product/${productId}`);
      setProduct(productRes.data);
      
      setShowReviewForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
      showError(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis');
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    // Show confirmation modal
    const confirmed = await new Promise((resolve) => {
      showWarning(
        'Êtes-vous sûr de vouloir supprimer votre avis ?',
        'Confirmer la suppression',
        () => resolve(true)
      );
      // We need to handle this differently - create a confirm modal
    });
    
    // For now, use window.confirm as fallback until we implement confirm modal
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre avis ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      await axios.delete(`http://127.0.0.1:8080/api/review/${userReview.id_review}`);
      showSuccess('Votre avis a été supprimé');
      
      setUserReview(null);
      setReviewRating(0);
      setReviewComment('');
      
      // Refresh reviews and product
      const productId = product.id_product || product.id;
      await fetchProductReviews(productId);
      
      // Refresh product to get updated rating
      const productRes = await axios.get(`http://127.0.0.1:8080/api/product/${productId}`);
      setProduct(productRes.data);
    } catch (error) {
      console.error("Failed to delete review:", error);
      showError('Erreur lors de la suppression de l\'avis');
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
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

  const handleAddToWishlist = async () => {
    if (!product) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      showError('Vous devez être connecté pour ajouter à la liste de souhaits', 'Connexion requise', () => {
        navigate('/login');
      });
      return;
    }

    const productId = product.id || product.id_product;
    const isInWishlist = wishlist.find(item => {
      const itemId = item.id || item.id_product;
      return itemId === productId;
    });

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`http://127.0.0.1:8080/api/wishlist/${productId}`);
        // Update local state
        const updatedWishlist = wishlist.filter(item => {
          const itemId = item.id || item.id_product;
          return itemId !== productId;
        });
        setWishlist(updatedWishlist);
      } else {
        // Add to wishlist
        await axios.post(`http://127.0.0.1:8080/api/wishlist/${productId}`);
        // Update local state
        setWishlist([...wishlist, product]);
      }
      
      // Dispatch custom event to notify Navbar and other components
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour de la liste de souhaits');
    }
  };

  const renderStars = (rating, size = 'w-5 h-5', interactive = false, onStarClick = null) => {
    const numRating = parseFloat(rating) || 0;
    const displayRating = interactive ? (hoveredStar || reviewRating) : numRating;
    
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        type={interactive ? "button" : undefined}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
        onMouseEnter={interactive ? () => setHoveredStar(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        className={interactive ? 'cursor-pointer' : ''}
      >
        <Star
          className={`${size} ${index < Math.floor(displayRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`}
        />
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Chargement du produit...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Aucun produit sélectionné.</div>
        </div>
      </div>
    );
  }

  const productId = product.id || product.id_product;
  const productName = product.name || product.product_name;
  const productPrice = parseFloat(product.price) || 0;
  const productStock = parseInt(product.stock) || 0;
  const isAvailable = productStock > 0;
  
  // Get all images
  const productImages = product?.images && product.images.length > 0 
    ? product.images.map(img => img.imageURL || img)
    : product?.image ? [product.image] : [];
  
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8080/uploads/${imageUrl}`;
  };
  
  const mainImage = productImages.length > 0 
    ? getImageUrl(productImages[selectedImageIndex])
    : getImageUrl(null);
  
  const productDescription = product.description || product.product_description || 'Aucune description disponible';
  const categoryName = product.category?.category_name || product.category_name || 'Catégorie non spécifiée';
  const subcategoryName = subcategory?.SubCategory_name || product.subcategory?.SubCategory_name || null;
  
  // Calculate average rating from client reviews
  const averageRating = calculateAverageRating();
  const displayRating = reviews.length > 0 ? averageRating : 0;

  // Build breadcrumb - prefer subcategory if exists, otherwise category
  const breadcrumbItems = [
    { name: 'Accueil', path: '/' },
    { name: subcategoryName || categoryName, path: subcategoryName ? null : `/Home_client/Productlist_client?category=${categoryName}` }
  ];
  
  // If subcategory exists, also show category
  if (subcategoryName) {
    breadcrumbItems.splice(1, 0, { name: categoryName, path: `/Home_client/Productlist_client?category=${categoryName}` });
  }
  
  breadcrumbItems.push({ name: productName, path: null });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600 flex-wrap">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-4 h-4" />}
                {item.path ? (
                  <button onClick={() => navigate(item.path)} className="hover:text-indigo-600 transition-colors">
                    {item.name}
                  </button>
                ) : (
                  <span className={index === breadcrumbItems.length - 1 ? 'text-gray-900 font-medium' : ''}>
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={mainImage}
                  alt={productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop';
                  }}
                />
                {!isAvailable && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    ÉPUISÉ
                  </div>
                )}
                {isAvailable && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    DISPONIBLE
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

            {/* Product Info */}
            <div className="flex flex-col space-y-6">
              {/* Title and Category/Subcategory */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{productName}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-lg text-gray-700">
                    Catégorie: {subcategoryName || categoryName}
                  </span>
                </div>
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-3">
                {isAvailable ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Non disponible
                  </span>
                )}
              </div>

              {/* Rating - from client reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(displayRating)}
                </div>
                <span className="text-gray-600 font-medium">
                  {reviews.length > 0 ? `(${displayRating.toFixed(1)}/5)` : '(Pas encore noté)'}
                </span>
                {reviews.length > 0 && (
                  <span className="text-sm text-gray-500">
                    ({reviews.length} {reviews.length === 1 ? 'avis' : 'avis'})
                  </span>
                )}
              </div>

              {/* Price */}
              <div>
                <span className="text-4xl font-bold text-red-600">
                  {productPrice.toFixed(2)} DH
                </span>
                {product.promo > 0 && (
                  <div className="mt-2">
                    <span className="text-xl text-gray-500 line-through mr-2">
                      {(productPrice / (1 - product.promo / 100)).toFixed(2)} DH
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      -{product.promo}%
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{productDescription}</p>
              </div>

              {/* Brand */}
              {product.brand && (
                <div>
                  <span className="text-sm text-gray-500">Marque:</span>
                  <span className="ml-2 text-gray-900 font-semibold">{product.brand}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isAvailable
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isAvailable ? 'Ajouter au panier' : 'Indisponible'}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    wishlist.find(item => (item.id || item.id_product) === productId)
                      ? 'bg-red-50 border-red-500 text-red-600'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                  }`}
                  title={wishlist.find(item => (item.id || item.id_product) === productId) ? 'Retirer de la liste de souhaits' : 'Ajouter à la liste de souhaits'}
                >
                  <Heart className={`w-6 h-6 ${wishlist.find(item => (item.id || item.id_product) === productId) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Avis clients ({reviews.length})
            </h2>
            {isLoggedIn && user && user.role === 'client' && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
              >
                {userReview ? 'Modifier mon avis' : 'Laisser un avis'}
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && isLoggedIn && user && (user.role === 'client' || user.rolee === 'client') && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {userReview ? 'Modifier votre avis' : 'Écrire un avis'}
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                  <div className="flex items-center gap-2">
                    {renderStars(reviewRating, 'w-6 h-6', true, (rating) => setReviewRating(rating))}
                    <span className="text-gray-600 ml-2">{reviewRating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Partagez votre expérience avec ce produit..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                  >
                    {userReview ? 'Mettre à jour' : 'Publier'}
                  </button>
                  {userReview && (
                    <button
                      type="button"
                      onClick={handleDeleteReview}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      if (!userReview) {
                        setReviewRating(0);
                        setReviewComment('');
                      }
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Existing Reviews */}
          {loadingReviews ? (
            <div className="text-center py-8 text-gray-600">Chargement des avis...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun avis pour le moment. Soyez le premier à laisser un avis !</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => {
                const clientName = review.client?.full_name || 'Client anonyme';
                const reviewDate = review.review_createdAt 
                  ? new Date(review.review_createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Date inconnue';

                return (
                  <div key={review.id_review} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{clientName}</h4>
                        <p className="text-sm text-gray-500">{reviewDate}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating_review || 0)}
                      </div>
                    </div>
                    {review.commentt && (
                      <p className="text-gray-700 leading-relaxed">{review.commentt}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
