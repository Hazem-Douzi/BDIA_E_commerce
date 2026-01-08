import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Heart, 
  Menu,
  Laptop,
  Smartphone,
  Tv,
  Headphones,
  Watch,
  Camera,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Phone,
  Mail,
  Truck,
  Shield,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = ({ products }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Categories with icons
  const categories = [
    { name: 'Laptops', icon: Laptop, color: 'bg-blue-500' },
    { name: 'Smartphones', icon: Smartphone, color: 'bg-green-500' },
    { name: 'TV & Display', icon: Tv, color: 'bg-purple-500' },
    { name: 'Gaming', icon: Headphones, color: 'bg-red-500' },
    { name: 'Wearables', icon: Watch, color: 'bg-pink-500' },
    { name: 'Cameras', icon: Camera, color: 'bg-yellow-500' }
  ];

  // Dummy brands data
  const brands = [
    { name: 'Apple', logo: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Apple' },
    { name: 'Samsung', logo: 'https://via.placeholder.com/150x60/1428A0/FFFFFF?text=Samsung' },
    { name: 'HP', logo: 'https://via.placeholder.com/150x60/0096D6/FFFFFF?text=HP' },
    { name: 'Dell', logo: 'https://via.placeholder.com/150x60/007DB8/FFFFFF?text=Dell' },
    { name: 'Lenovo', logo: 'https://via.placeholder.com/150x60/E2231A/FFFFFF?text=Lenovo' },
    { name: 'Sony', logo: 'https://via.placeholder.com/150x60/000000/FFFFFF?text=Sony' }
  ];

  // Process products for display
  const featuredProducts = products && products.length > 0 
    ? products.slice(0, 8).map(product => ({
        id: product.id || product.id_product,
        name: product.name || product.product_name,
        description: product.description || product.product_description,
        price: product.price || 0,
        originalPrice: product.originalPrice || product.price * 1.2,
        image: product.image || product.imageURL || `https://via.placeholder.com/300x300/6366f1/FFFFFF?text=${encodeURIComponent((product.name || 'Product').substring(0, 10))}`,
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

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    setShowCartDropdown(true);
    setTimeout(() => setShowCartDropdown(false), 2000);
  };

  const handleAddToWishlist = (product) => {
    if (wishlist.find(w => w.id === product.id)) {
      setWishlist(wishlist.filter(w => w.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/Home_client/Productlist_client?search=${searchQuery}`);
  };

  const handleMyProducts = () => navigate("/Home_client/Productlist_client");
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => navigate("/Home_client");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Support Bar */}
      <div className="bg-gray-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Support: +1 234 567 890</span>
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free shipping on orders over $99</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div 
              onClick={handleHomeClick}
              className="text-2xl font-bold text-indigo-600 cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-8 h-8" />
              <span>ShopEase</span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, and more..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-800"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleProfile}
                className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                title="Account"
              >
                <User className="w-6 h-6" />
              </button>
              
              <button
                className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCartDropdown(!showCartDropdown)}
                  className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  title="Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Shopping Cart</h3>
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                      ) : (
                        <>
                          <div className="max-h-60 overflow-y-auto">
                            {cart.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                                  <div className="text-sm font-semibold text-red-600">${item.price}</div>
                                </div>
                                <button 
                                  onClick={() => setCart(cart.filter((_, i) => i !== index))}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="text-lg font-bold text-gray-800 mb-3">
                              Total: ${cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2)}
                            </div>
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                              Proceed to Checkout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-6 overflow-x-auto py-3">
              <button className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 whitespace-nowrap font-medium">
                <Menu className="w-5 h-5" />
                <span>All Categories</span>
              </button>
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(`/Home_client/Productlist_client?category=${category.name}`)}
                    className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 whitespace-nowrap transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -8 }}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-500 hover:shadow-lg transition-all group"
                  onClick={() => navigate(`/Home_client/Productlist_client?category=${category.name}`)}
                >
                  <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-800">{category.name}</h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products / Best Sellers */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Best Sellers</h2>
            <button
              onClick={handleMyProducts}
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
            >
              View All <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const isInWishlist = wishlist.find(w => w.id === product.id);
                return (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-xl transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
                          -{product.discount}%
                        </div>
                      )}
                      <button
                        onClick={() => handleAddToWishlist(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full z-10 transition-colors ${
                          isInWishlist 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => handleViewProduct(product.id)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 
                        className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12 cursor-pointer hover:text-indigo-600"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-red-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.available}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          product.available
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.available ? 'Add to Cart' : 'Out of Stock'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products available at the moment.</p>
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
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-16 cursor-pointer hover:opacity-100 transition-opacity"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 object-contain"
                />
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
    </div>
  );
};

export default HomePage;
