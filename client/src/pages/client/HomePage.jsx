import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Star,
  Mail,
  Shield,
  MessageCircle,
  ShoppingBag,
  Truck,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

const HomePage = ({ products }) => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });


  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8080/api/wishlist/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWishlist(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        // Only log error if it's not a 401/403 (user not logged in)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('Failed to fetch wishlist:', error);
        }
        setWishlist([]);
      }
    };

    fetchWishlist();
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://127.0.0.1:8080/api/category");
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        // Map database categories to format with icons and colors
        const mappedCategories = categoriesData.map((cat, index) => {
          const iconColors = ['💻', '📱', '📺', '🎮', '⌚', '📷', '💎', '🔊', '⌨️', '🖥️'];
          const bgColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-pink-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'];
          return {
            id: cat.id_category,
            name: cat.category_name,
            icon: iconColors[index % iconColors.length],
            color: bgColors[index % bgColors.length],
            description: cat.category_description,
            image: cat.image
          };
        });
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch top sellers
  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        setLoadingSellers(true);
        const res = await axios.get("http://127.0.0.1:8080/api/product/top-sellers?limit=5");
        const sellersData = Array.isArray(res.data) ? res.data : [];
        setTopSellers(sellersData);
      } catch (error) {
        console.error("Failed to load top sellers:", error);
        setTopSellers([]);
      } finally {
        setLoadingSellers(false);
      }
    };
    fetchTopSellers();
  }, []);

  // Hero carousel auto-play
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(carouselTimer);
  }, []);

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Year-End Tech Deals",
      subtitle: "Up to 50% off on latest electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&q=80",
      buttonText: "Shop Now",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "New Arrivals",
      subtitle: "Discover the latest smartphones and gadgets",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1920&q=80",
      buttonText: "Explore",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Gaming Collection",
      subtitle: "Level up with premium gaming gear",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80",
      buttonText: "Shop Gaming",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/Home_client/Productlist_client?category=${categoryName}`);
  };

  const handleMyProducts = () => navigate("/Home_client/Productlist_client");

  // Brands data (text-based since we don't have actual logos)
  const brands = [
    { name: 'Apple' },
    { name: 'Samsung' },
    { name: 'HP' },
    { name: 'Dell' },
    { name: 'Lenovo' },
    { name: 'Sony' }
  ];

  // Process products for display
  const featuredProducts = products && products.length > 0 
    ? products.slice(0, 8).map(product => ({
        id: product.id || product.id_product,
        name: product.name || product.product_name,
        description: product.description || product.product_description,
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price * 1.2,
        image: product.image || product.imageURL || product.image_url || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop`,
        discount: product.promo || product.discount || 20,
        rating: product.rate || product.rating || 4.5,
        available: product.available !== false,
        category: product.category || 'Electronics'
      }))
    : [];

  const handleViewProduct = (productId) => {
    const product = products?.find(p => (p.id || p.id_product) === productId);
    if (product) {
      // Store product in localStorage for product detail page
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      navigate('/Productlist/ProductDetlail');
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

  const handleAddToWishlist = async (product) => {
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
      
      // Trigger wishlist update event
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour de la liste de souhaits');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Carousel Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundBlendMode: 'overlay'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8">
                    {slide.subtitle}
                  </p>
                  <button
                    onClick={() => navigate('/Home_client/Productlist_client')}
                    className={`${slide.buttonColor} text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg`}
                  >
                    {slide.buttonText}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-20 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          {loadingCategories ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => {
                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ y: -8 }}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all group"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform overflow-hidden`}>
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const icon = e.target.parentElement.querySelector('.category-icon-fallback');
                            if (icon) icon.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <span className="text-3xl category-icon-fallback" style={{ display: category.image ? 'none' : 'block' }}>{category.icon}</span>
                    </div>
                    <h3 className="text-center font-semibold text-gray-800">{category.name}</h3>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers (Top Sellers by Product Count) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Best Sellers</h2>
            <button
              onClick={handleMyProducts}
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
            >
              View All Products <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {loadingSellers ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading top sellers...</p>
            </div>
          ) : topSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {topSellers.map((seller) => {
                const shopName = seller.seller_profile?.shop_name || seller.full_name || 'Shop';
                const shopImage = seller.shop_image || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop`;
                const productCount = seller.product_count || 0;
                const isVerified = seller.seller_profile?.verification_status === 'verified';
                const sellerId = seller.id_user || seller.id;
                
                return (
                  <motion.div
                    key={sellerId}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => navigate(`/Home_client/Productlist_client?seller=${sellerId}`)}
                  >
                    {/* Shop Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={shopImage}
                        alt={shopName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                        }}
                      />
                      {isVerified && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Shop Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 text-lg line-clamp-1">
                        {shopName}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {productCount} {productCount === 1 ? 'Product' : 'Products'}
                        </span>
                        <span className="text-indigo-600 text-sm font-semibold hover:text-indigo-700">
                          Visit Shop →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sellers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="py-12 bg-gradient-to-r from-red-500 via-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                alt="Flash Sale Product"
                className="w-64 h-64 md:w-80 md:h-80 object-contain"
              />
            </div>

            {/* Sale Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Flash Sale!
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Up to 50% off on selected items - Limited time only!
              </p>

              {/* Countdown Timer */}
              <div className="flex gap-4 justify-center md:justify-start mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[70px]">
                  <div className="text-3xl font-bold text-white">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[70px]">
                  <div className="text-3xl font-bold text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[70px]">
                  <div className="text-3xl font-bold text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Minutes</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[70px]">
                  <div className="text-3xl font-bold text-white">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-white/80 mt-1">Seconds</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/Home_client/Productlist_client')}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Shop Sale Items
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Strip */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 cursor-pointer text-gray-600 hover:text-gray-900 font-semibold text-lg transition-colors"
              >
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* ShopEase Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                ShopEase
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted online shopping destination for the latest electronics and tech products.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Return Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Our Story</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Press</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>

            {/* Newsletter Subscribe */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe to Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Get the latest deals and updates delivered to your inbox.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 ShopEase. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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

export default HomePage;
