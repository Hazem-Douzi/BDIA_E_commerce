import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  User,
  ShoppingCart,
  Heart,
  Menu,
  ShoppingBag,
  Phone,
  Truck,
  ChevronDown,
  LogIn,
  Grid3x3
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);


  // Function to fetch cart from backend API
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token || !isLoggedIn) {
      setCart([]);
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8080/api/cart/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && response.data.items) {
        // Transform cart items to match expected format
        const cartItems = response.data.items.map(item => ({
          ...item.product,
          quantity: item.quantity,
          id_cart_item: item.id_cart_item
        }));
        setCart(cartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      // Only log error if it's not a 401/403 (user not logged in)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error('Failed to fetch cart:', error);
      }
      setCart([]);
    }
  };

  // Function to fetch wishlist from backend API
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

  // Check if user is logged in and fetch categories
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    
    // Fetch cart from backend if logged in
    if (token && loggedIn) {
      fetchCart();
    } else {
      setCart([]);
    }

    // Fetch wishlist from backend if logged in
    if (token) {
      fetchWishlist();
    }

    // Fetch categories from database
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://127.0.0.1:8080/api/category");
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();

    // Listen for custom events (same-tab updates) - for wishlist and cart from backend
    const handleWishlistUpdate = () => {
      if (token) {
        fetchWishlist();
      }
    };

    const handleCartUpdate = () => {
      if (token) {
        fetchCart();
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Poll for cart and wishlist changes periodically (refresh from backend)
    let interval;
    if (token) {
      interval = setInterval(() => {
        fetchCart();
        fetchWishlist();
      }, 3000); // Check every 3 seconds
    }

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCategoriesDropdown && !event.target.closest('.categories-dropdown-container')) {
        setShowCategoriesDropdown(false);
      }
      if (showCartDropdown && !event.target.closest('.cart-dropdown-container')) {
        setShowCartDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoriesDropdown, showCartDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/Home_client/Productlist_client?search=${searchQuery}`);
  };

  const handleHomeClick = () => navigate("/");
  const handleProfile = () => navigate("/Profile_client");
  const handleSignIn = () => navigate("/login");
  const handleSupport = () => {
    // Navigate to support page or open support modal
    window.open('tel:+1234567890', '_self');
  };
  const handleTrackOrder = () => {
    // Navigate to track order page
    navigate("/Home_client/Productlist_client?filter=orders");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCart([]); // Clear cart on logout
    setWishlist([]); // Clear wishlist on logout
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };
  
  const handleCategoryClick = (categoryName) => {
    setShowCategoriesDropdown(false);
    navigate(`/Home_client/Productlist_client?category=${categoryName}`);
  };

  const handleAllProductsClick = () => {
    navigate('/Home_client/Productlist_client');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main Navigation */}
      <div className="bg-white border-b border-gray-200">
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

            {/* All Categories Dropdown & Search Bar */}
            <div className="flex-1 flex items-center gap-3 max-w-3xl mx-4">
              {/* All Categories Dropdown */}
              <div className="relative categories-dropdown-container">
                <button 
                  onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 whitespace-nowrap font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 hover:border-indigo-500 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                  <span className="hidden md:inline">All Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Categories Dropdown Menu */}
                {showCategoriesDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2 max-h-96 overflow-y-auto">
                    {loadingCategories ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">Loading categories...</div>
                    ) : categories.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">No categories available</div>
                    ) : (
                      categories.map((category) => (
                        <button
                          key={category.id_category}
                          onClick={() => handleCategoryClick(category.category_name)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-left"
                        >
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.category_name}
                              className="w-6 h-6 rounded object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : null}
                          <span>{category.category_name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* All Products Button */}
              <button
                onClick={handleAllProductsClick}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 whitespace-nowrap font-medium bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 hover:border-indigo-500 transition-colors"
              >
                <Grid3x3 className="w-5 h-5" />
                <span className="hidden md:inline">All Products</span>
              </button>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits, marques, et plus..."
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
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Sign In / Profile */}
              {isLoggedIn ? (
                <button
                  onClick={handleProfile}
                  className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  title="Profile"
                >
                  <User className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                  title="Sign In"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
              
              {/* Wishlist - Only show when logged in */}
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/wishlist')}
                  className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
                  title="Liste de souhaits"
                >
                  <Heart className="w-6 h-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              )}

              {/* Cart with Dropdown - Show total and count */}
              {(isLoggedIn || cart.length > 0) && (
              <div className="relative cart-dropdown-container">
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setShowCartDropdown(!showCartDropdown);
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-indigo-600 transition-colors rounded-lg hover:bg-gray-50"
                  title="Panier"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cart.length > 0 && (
                    <>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold text-gray-900">
                          {cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2)} DH
                        </span>
                        <span className="text-xs text-gray-500">
                          {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} {cart.reduce((sum, item) => sum + (item.quantity || 1), 0) === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                      </span>
                    </>
                  )}
                </button>

                {/* Cart Dropdown */}
                {showCartDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Panier</h3>
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
                      ) : (
                        <>
                          <div className="max-h-60 overflow-y-auto">
                            {cart.map((item) => {
                              const productImage = item.images?.[0]?.imageURL || item.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                              const imageUrl = productImage.startsWith('http') 
                                ? productImage 
                                : `http://127.0.0.1:8080/uploads/${productImage}`;
                              const productName = item.product_name || item.name || 'Produit';
                              const price = item.price || 0;
                              
                              return (
                                <div key={item.id_cart_item || item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                                  <img 
                                    src={imageUrl} 
                                    alt={productName} 
                                    className="w-12 h-12 object-cover rounded"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">{productName}</div>
                                    <div className="text-xs text-gray-500">Qté: {item.quantity || 1}</div>
                                    <div className="text-sm font-semibold text-red-600">{(price * (item.quantity || 1)).toFixed(2)} DH</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <div className="text-lg font-bold text-gray-800 mb-3">
                              Total: {cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)} DH
                            </div>
                            <button 
                              onClick={() => {
                                setShowCartDropdown(false);
                                navigate('/checkout');
                              }}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                              Aller au checkout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Sign In Button (if logged out) or Logout (if logged in) */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors ml-2"
                >
                  Sign Out
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;