import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./login.jsx";

// Client importation
import Productlist_client from "./componnent/client_comoponent/Productlist"
import Home_client from "./componnent/client_comoponent/HomePage.jsx";
import Register from "./register.jsx";
import Profile_client from "./componnent/client_comoponent/Client_profile.jsx";
import UpdateClient from "./componnent/client_comoponent/UpdateClient.jsx"
import ProductDetlail from "./componnent/client_comoponent/Productdetlai"
import { searchByname ,filterByBrand ,filterByState ,filterByCategory ,filterByminMaxPrice,filterByAvailable ,filterByDate} from "./componnent/client_comoponent/SearchMethods.jsx"

// Seller importation
import Home_seller from "./componnent/seller_component/HomePage.jsx";
import Profile_seller from "./componnent/seller_component/Seller_profile.jsx";
import Add_product from "./componnent/seller_component/Add_product.jsx";
import Productlist from "./componnent/seller_component/Productlist";
import Productdetlai from "./componnent/seller_component/Productdetlai";
import Update_product from "./componnent/seller_component/Update_product.jsx";
import UpdateSeller from "./componnent/seller_component/UpdateSeller"

// Admin importation
import All_client from "./componnent/admin_component/All_client";
import All_prod from "./componnent/admin_component/All_prod.jsx";
import All_seller from "./componnent/admin_component/All_seller.jsx";
import Home_admin from "./componnent/admin_component/Home_admin.jsx";

function App() {
  const [products, setProducts] = useState([]);
  const [selectedprod, setSelectprod] = useState([]);
  const [selectedSeller,setSelectedSeller]= useState([]);
  const [selectedClient,setSelectedClient]= useState([]);



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


 const handleFilter = async (filterFunc, value) => {
  try {
    const filtered = await filterFunc(value)
    setProducts(filtered);
  } catch (error) {
    console.error("couldn't filter prods :", error)
  }
}
  
  return (
    <Router>
      <div className="App">
        <Routes>

          {/* Client Routes */}
          <Route path="/" element={<Home_client products={products}/>} />
          <Route path="/Home_client" element={<Home_client products={products}/>} />
          <Route path="/Profile_client" element={<Profile_client handleSelectedClient={handleSelectedClient}/>} />
          <Route path="/Profile_client/UpdateClient" element={<UpdateClient selectedClient={selectedClient} />}/>      
          <Route path="/Home_client/Productlist_client" element={<Productlist_client
      products={products}
      handleselectedProd={handleselectedProd}
      handleFilter={handleFilter}
      searchByname={searchByname}
      filterByBrand={filterByBrand}
      filterByState={filterByState}
      filterByCategory={filterByCategory}
      filterByminMaxPrice={filterByminMaxPrice}
      filterByAvailable={filterByAvailable}
      filterByDate={filterByDate}
      fetchProducts={fetchProducts}
      />}/>
          <Route path="/Productlist/ProductDetlail" element={<ProductDetlail selectedprod={selectedprod}/>} />
          
          {/* Seller Routes */}
          <Route path="/Home_seller" element={<Home_seller />} />
          <Route path="/Home_seller/profile" element={<Profile_seller  handleSelectedSeller={handleSelectedSeller}/>} />
          <Route path="/Home_seller/add_product" element={<Add_product fetchProducts={fetchProducts} selectedSeller={selectedSeller}/>} />
          <Route path="/Home_seller/my_products" element={<Productlist  handleselectedProd={handleselectedProd}/>}/>
          <Route path="/Home_seller/Productdetlai" element={<Productdetlai selectedprod={selectedprod} fetchProducts={fetchProducts}/>}/>
          <Route path="/Home_seller/Update_product" element={<Update_product selectedprod={selectedprod} fetchProducts={fetchProducts}/>}/>
          <Route path="/Home_seller/profile/UpdateSeller" element={<UpdateSeller selectedSeller={selectedSeller} />}/>          
          {/* Admin Routes */}
          <Route path="/Home_admin" element={<Home_admin />} />
          <Route path="/Home_admin/All_client" element={<All_client />} />
          <Route path="/Home_admin/All_prod" element={<All_prod />} />
          <Route path="/Home_admin/All_seller" element={<All_seller />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
