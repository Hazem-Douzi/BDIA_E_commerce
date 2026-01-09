import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Auth pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// Client pages
import HomePage from "./pages/client/HomePage.jsx";
import ProductList from "./pages/client/ProductList.jsx";
import ProductDetail from "./pages/client/ProductDetail.jsx";
import ClientProfile from "./pages/client/Profile.jsx";
import UpdateClient from "./pages/client/UpdateProfile.jsx";
import WishlistPage from "./pages/client/WishlistPage.jsx";
import CheckoutPage from "./pages/client/CheckoutPage.jsx";
import PaymentPage from "./pages/client/PaymentPage.jsx";
import CheckoutSuccessPage from "./pages/client/CheckoutSuccessPage.jsx";

// Seller pages
import SellerHome from "./pages/seller/HomePage.jsx";
import SellerProductList from "./pages/seller/ProductList.jsx";
import SellerProductDetail from "./pages/seller/ProductDetail.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import UpdateProduct from "./pages/seller/UpdateProduct.jsx";
import SellerProfile from "./pages/seller/Profile.jsx";
import UpdateSeller from "./pages/seller/UpdateProfile.jsx";
import SellerOrders from "./pages/seller/Orders.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AllClients from "./pages/admin/AllClients.jsx";
import AllProducts from "./pages/admin/AllProducts.jsx";
import AllSellers from "./pages/admin/AllSellers.jsx";
import AllCategories from "./pages/admin/AllCategories.jsx";
import AllSubCategories from "./pages/admin/AllSubCategories.jsx";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedprod, setSelectprod] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleselectedProd = (prod) => {
    setSelectprod(prod);
  };
  
  const handleSelectedSeller = (seller) => {
    setSelectedSeller(seller);
  };
  
  const handleSelectedClient = (client) => {
    setSelectedClient(client);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/api/product/All");
      setProducts(res.data);
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  
  console.log("products", products);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/Profile_client" element={<ClientProfile handleSelectedClient={handleSelectedClient} />} />
          <Route path="/Profile_client/UpdateClient" element={<UpdateClient selectedClient={selectedClient} />} />      
          <Route path="/Home_client/Productlist_client" element={<ProductList handleselectedProd={handleselectedProd} />} />
          <Route path="/Productlist/ProductDetlail/:id" element={<ProductDetail selectedprod={selectedprod} />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/payment" element={<PaymentPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          
          {/* Seller Routes */}
          <Route path="/Home_seller" element={<SellerHome />} />
          <Route path="/Home_seller/profile" element={<SellerProfile handleSelectedSeller={handleSelectedSeller} />} />
          <Route path="/Home_seller/add_product" element={<AddProduct fetchProducts={fetchProducts} selectedSeller={selectedSeller} />} />
          <Route path="/Home_seller/my_products" element={<SellerProductList handleselectedProd={handleselectedProd} />} />
          <Route path="/Home_seller/Productdetlai/:id" element={<SellerProductDetail selectedprod={selectedprod} fetchProducts={fetchProducts} />} />
          <Route path="/Home_seller/Update_product/:id" element={<UpdateProduct selectedprod={selectedprod} fetchProducts={fetchProducts} />} />
          <Route path="/Home_seller/profile/UpdateSeller" element={<UpdateSeller selectedSeller={selectedSeller} />} />
          <Route path="/Home_seller/orders" element={<SellerOrders />} />          
          
          {/* Admin Routes */}
          <Route path="/Home_admin" element={<AdminDashboard />} />
          <Route path="/Home_admin/All_client" element={<AllClients />} />
          <Route path="/Home_admin/All_prod" element={<AllProducts />} />
          <Route path="/Home_admin/All_seller" element={<AllSellers />} />
          <Route path="/Home_admin/All_categories" element={<AllCategories />} />
          <Route path="/Home_admin/All_subcategories" element={<AllSubCategories />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
