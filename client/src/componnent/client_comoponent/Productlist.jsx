import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import '../../App.css';
import SearchProduct from "./SearchProduct.jsx"

export default function ProductList({ handleselectedProd ,products,
  handleFilter,
  searchByname,
  filterByBrand,
  filterByState,
  filterByCategory,
  filterByminMaxPrice,
  filterByAvailable,
  filterByDate,
  fetchProducts
}) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(false)
  const [offerProduct, setOfferProduct] = useState(null)
  const [offerAmount, setOfferAmount] = useState(0)
    console.log("products",products)
    const handleMyProducts = () => navigate("/Home_client/Productlist_client");  
  const handleProfile = () => navigate("/Profile_client");
  const handleHomeClick = () => {navigate("/Home_client");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCart([]);
        setCartTotal(0);
        return;
      }
      const res = await axios.get("http://127.0.0.1:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(res.data.items || []);
      setCartTotal(res.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCart([]);
      setCartTotal(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (showCartDropdown) {
      fetchCart();
    }
  }, [showCartDropdown]);

  // Cart and Wishlist Functions
  const handleAddToCart = async (product) => {
    const quantity = quantities[product.id_product] || 1;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }
      await axios.post(
        "http://127.0.0.1:8080/api/cart/add",
        {
          id_product: product.id_product,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCart();
      alert(`${product.product_name} has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

   const handleOffer =  async () => {
    
    try { 
      
      await axios.patch(`http://localhost:8080/api/product/offer/${offerProduct.id}`, {
        offer: parseFloat(offerAmount),
      })
      console.log("offer mrigla")
      await fetchProducts()
      setShowOfferPopup(false)
      setOfferAmount('')
    } catch (error) {
      console.error(error)
    }
  
}

  const handleAddToWishlist = (product) => {
    if (wishlist.find(item => item.id_product === product.id_product)) {
      setWishlist(wishlist.filter(item => item.id_product !== product.id_product));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const handleQuantityChange = (productId, change) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change)
    }));
  };

  const renderStarsSafe = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? '' : 'empty'}`}>★</span>
    ));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`star ${index < rating ? '' : 'empty'}`}>★</span>
    ));
  };





  return (
    <div>
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
                              src={item.product?.images?.[0]?.imageURL || 'https://via.placeholder.com/50x50'} 
                              alt={item.product?.product_name} 
                              className="cart-item-image w-12 h-12 object-cover rounded"
                            />
                            <div className="cart-item-info flex-1">
                              <div className="cart-item-name text-sm font-medium text-gray-800">{item.product?.product_name}</div>
                              <div className="cart-item-price text-sm font-semibold text-red-600">{item.product?.price} TND</div>
                              <div className="text-xs text-gray-500">Qty: {item.quantity || 1}</div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const token = localStorage.getItem("token");
                                if (!token) return;
                                axios.delete(`http://127.0.0.1:8080/api/cart/item/${item.id_cart_item}`, {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }).then(fetchCart).catch((error) => {
                                  console.error("Failed to remove cart item:", error);
                                });
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
                          Total: {cartTotal.toFixed(2)} TND
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


      {/* Enhanced Product Grid */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">

                      <SearchProduct
  handleFilter={handleFilter}
  searchByname={searchByname}
  filterByBrand={filterByBrand}
  filterByState={filterByState}
  filterByCategory={filterByCategory}
  filterByminMaxPrice={filterByminMaxPrice}
  filterByAvailable={filterByAvailable}
  filterByDate={filterByDate}
  products={products}
  fetchProducts={fetchProducts}
/>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h2>
            <p className="text-gray-600">Discover amazing products at great prices</p>
          </div>

          <div className="products-grid-enhanced">
            {products.map((product) => (
              <div key={product.id_product} className="product-card-enhanced">
                <div className="product-image-container">
                  <img
                    src={product.images?.[0]?.imageURL || 'https://via.placeholder.com/300x280'}
                    alt={product.product_name}
                  />
                  
                  {/* Status Badge */}
                  <span className={`product-status-badge ${product.stock > 0 ? 'available' : 'out-of-stock'}`}>
                    {product.stock > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                  
                  {/* Negotiable Badge */}
                  {product.negociable && (
                    <span className="negotiable-badge">Negotiable</span>
                  )}
                  
                  {/* Wishlist Button */}
                  <button 
                    className={`wishlist-btn ${wishlist.find(item => item.id_product === product.id_product) ? 'active' : ''}`}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    {wishlist.find(item => item.id_product === product.id_product) ? "♥" : "♡"}
                  </button>
                  
                  {/* Quick Actions Overlay */}
                  <div className="quick-actions-overlay">
                    <button 
                      className="quick-action-btn"
                      onClick={() => {navigate("/Productlist/ProductDetlail");handleselectedProd(product)}}
                    >
                      Quick View
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                  
                  {/* Sold Out Overlay */}
                  {product.stock <= 0 && (
                    <div className="sold-out-overlay">
                      <span className="sold-out-text">Sold Out</span>
                    </div>
                  )}
                </div>
                
                <div className="product-content">
                  <h3 className="product-title">{product.product_name}</h3>
                  <p className="product-description">{product.product_description || 'No description available'}</p>
                  
                  {/* Product Info Tags */}
                  <div className="product-info-tags">
                    {product.brand && <span className="info-tag brand">{product.brand}</span>}
                    {product.delivered && <span className="info-tag delivery">Free Delivery</span>}
                    {product.verified && <span className="info-tag verified">Verified</span>}
                  </div>
                  
                  {/* Rating */}
                  <div className="product-rating">
                    <div className="star-rating-display">
                      {renderStarsSafe(product.rating || 0)}
                    </div>
                    <span className="rating-text">({product.rating || 0}/5)</span>
                  </div>
                  
                  {/* Price Section */}
                  <div className="product-price-section">
                    <div className="product-price">
                      <span className="currency">TND </span>{product.price}
                      {product.promo > 0 && (
                        <span className="discount">TND {(product.price / (1 - product.promo/100)).toFixed(2)}</span>
                      )}
                    </div>
                    {product.promo > 0 && (
                      <span className="promo-badge">{product.promo}% OFF</span>
                    )}
                    {product.offer !== undefined && (
      <div className="product-offer text-sm text-green-700 mt-1"> Offer: TND {product.offer}</div>)}</div>
                  
                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="quantity-selector">
                      <span className="quantity-label">Qty:</span>
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(product.id_product, -1)}
                          disabled={(quantities[product.id_product] || 1) <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">{quantities[product.id_product] || 1}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(product.id_product, 1)}
                          disabled={(quantities[product.id_product] || 1) >= (product.stock || 10)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="product-actions-enhanced">
                    <button 
                      className="add-to-cart-enhanced"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      <svg className="cart-icon-btn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Add to Cart
                    </button>
                    
                    {product.negociable && (
                      <button 
                        className="secondary-action-btn make-offer-btn"
                         onClick={() => {
                          setOfferProduct(product);
                          setOfferAmount(product.offer || 0)
                          setShowOfferPopup(true);
                                }}
                                >
                            Make Offer
                            </button>
                              )}
                    
                    <button 
                      className="secondary-action-btn"
                      onClick={() => {navigate("/Productlist/ProductDetlail");handleselectedProd(product)}}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  {showOfferPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Make an Offer</h2>
      <p className="text-gray-700 mb-2">Product: <strong>{offerProduct?.name}</strong></p>
        <input type="number" placeholder="Enter your offer (TND)"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            className="w-full p-2 border rounded mb-4 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
            />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowOfferPopup(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button onClick={handleOffer}
  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
>
  Submit
</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
