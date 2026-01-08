import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

const HomePage = ({products}) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [homeData, setHomeData] = useState({
    featured_products: [],
    categories: [],
    recent_products: []
  });
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });


  // Fetch home page data from the new API
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8080/api/client/home');
        setHomeData(response.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback to existing data if API fails
        setHomeData({
          featured_products: products.slice(0, 8),
          categories: ['Laptop', 'Phone', 'TV'],
          recent_products: products.slice(0, 6)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [products]);





  const handleMyProducts = () => navigate("/Home_client/Productlist_client");
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => {navigate("/Home_client");};
  const handleViewProduct = (productId) => {
    // You can implement product detail navigation here
    // For now, let's navigate to the product list and pass the product ID
    navigate("/Home_client/Productlist_client", { state: { selectedProductId: productId } });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">ShopEase Client</div>
        <nav className="space-x-4 flex items-center">
          <button
            onClick={handleHomeClick}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Home
          </button>
          <button
            onClick={handleMyProducts}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            My Products
          </button>

          <button
            onClick={handleProfile}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Profile
          </button>
          
          {/* Cart Icon with Badge */}
          <div className="cart-icon relative" onClick={() => setShowCartDropdown(!showCartDropdown)}>
            <svg 
              className="w-6 h-6 text-gray-700 hover:text-indigo-600 cursor-pointer" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" 
              />
            </svg>
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
            
            {/* Cart Dropdown */}
            {showCartDropdown && (
              <div className="cart-dropdown absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50" style={{minWidth: '300px'}}>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shopping Cart</h3>
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="max-h-60 overflow-y-auto">
                        {cart.map((item, index) => (
                          <div key={index} className="cart-item flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="cart-item-image w-12 h-12 object-cover rounded"
                            />
                            <div className="cart-item-info flex-1">
                              <div className="cart-item-name text-sm font-medium text-gray-800">{item.name}</div>
                              <div className="cart-item-price text-sm font-semibold text-red-600">${item.price}</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCart(cart.filter((_, i) => i !== index));
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-total mt-4 pt-3 border-t border-gray-200">
                        <div className="cart-total-amount text-lg font-bold text-gray-800 mb-3">
                          Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                        </div>
                        <button className="checkout-btn w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5">
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
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </nav>
      </header>


  

     
      {/* Hero Section */}
      <section className="hero">
        <h1>Discover Amazing Products</h1>
        <p>Shop the latest trends with unbeatable prices and fast delivery</p>
        <button className="btn" onClick={() => navigate('/Home_client/Productlist_client')}>Shop Now</button>
      </section>

      {/* Categories Section */}
      <section className="categories" id="categories">
        <h2 className="section-title">Shop by Category</h2>
        <div className="category-list">
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            homeData.categories.map((category, index) => (
              <div key={category.id_category || index} className="category-item">
                {category.category_name}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="products">
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid">
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            homeData.featured_products.map((product) => (
              <div key={product.id_product} className="product-card">
                <img
                  src={product.images && product.images.length > 0 ? `http://127.0.0.1:8080/uploads/${product.images[0].imageURL}` : '/placeholder-image.jpg'}
                  alt={product.product_name}
                  onClick={() => handleViewProduct(product.id_product)}
                  style={{ cursor: 'pointer' }}
                />
                <h3 className="product-title">{product.product_name}</h3>
                <p className="product-desc">{product.product_description}</p>
                <div className="product-info">
                  <div className="product-price">${product.price}</div>
                  <div className="product-status">
                    {product.stock > 0 ? (
                      <span className="available">✓ Available</span>
                    ) : (
                      <span className="unavailable">✗ Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="products">
        <h2 className="section-title">New Arrivals</h2>
        <div className="product-grid">
          {loading ? (
            <div className="text-center py-8">Loading recent products...</div>
          ) : (
            homeData.recent_products.map((product) => (
              <div key={product.id_product} className="product-card">
                <img
                  src={product.images && product.images.length > 0 ? `http://127.0.0.1:8080/uploads/${product.images[0].imageURL}` : '/placeholder-image.jpg'}
                  alt={product.product_name}
                  onClick={() => handleViewProduct(product.id_product)}
                  style={{ cursor: 'pointer' }}
                />
                <h3 className="product-title">{product.product_name}</h3>
                <p className="product-desc">{product.product_description}</p>
                <div className="product-info">
                  <div className="product-price">${product.price}</div>
                  <div className="product-status">
                    {product.stock > 0 ? (
                      <span className="available">✓ Available</span>
                    ) : (
                      <span className="unavailable">✗ Out of Stock</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Limited Time Offer Section */}
      <section className="offer">
        <h2>Limited Time Offer</h2>
        <p>Up to 50% off on selected items</p>
        <div className="timer">
          <div className="timer-item">
            <div className="timer-number">{String(timeLeft.days).padStart(2, '0')}</div>
            <div>Days</div>
          </div>
          <div className="timer-item">
            <div className="timer-number">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div>Hours</div>
          </div>
          <div className="timer-item">
            <div className="timer-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div>Minutes</div>
          </div>
          <div className="timer-item">
            <div className="timer-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div>Seconds</div>
          </div>
        </div>
        <button className="shop-btn">Shop Sale Items</button>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopEase</h3>
            <p>Your trusted online shopping destination</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#shipping">Shipping</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              {homeData.categories.map((category, index) => (
                <li key={category.id_category || index}>
                  <a href={`#${category.category_name?.toLowerCase()}`}>{category.category_name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};


export default HomePage;
