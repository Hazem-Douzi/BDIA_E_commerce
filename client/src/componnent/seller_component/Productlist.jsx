import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

export default function ProductList({ handleselectedProd }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
    // const[selectedImg,setSelectedImg]=useState([])
  const handleMyProducts = () => navigate("/Home_seller/my_products");
  const handleAddProduct = () => navigate("/Home_seller/add_product");
  const handleProfile = () => navigate("/Home_seller/profile");
  const handleHomeClick = () => {navigate("/Home_seller");};
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };
const fetchProducts = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      setProducts([]);
      return;
    }
    const res = await axios.get(`http://127.0.0.1:8080/api/product/spec/${user.id}`);
    setProducts(res.data || []);
  } catch (error) {
    console.log("Error:", error.message);
  }
};


useEffect(() => {
  fetchProducts();
}, []);

//  const getImages=(productsId)=>{
//     axios.get(`http://localhost:8080/api/photos/${productsId}`)
//       .then(function (response) {
//     setSelectedImg(response.data)

//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//  }



  return (
    <div>
  {/* Navbar */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-600">ShopEase Seller</div>
        <nav className="space-x-4">
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
            onClick={handleAddProduct}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Add Product
          </button>
          <button
            onClick={handleProfile}
            className="text-gray-700 hover:text-indigo-600 font-medium"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </nav>
      </header>


      {/* Product Grid */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id_product} className="group border p-2 rounded-lg shadow-sm">
                {/* Show first image */}
                {console.log(product)}
                <img
                  alt={product.product_name}
                  src={product.images?.[0]?.imageURL}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                />
                
                <h3 className="mt-4 text-sm text-gray-700">{product.product_name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>

                {/* Details Link */}
                <button
                  className="mt-4 text-blue-500 hover:underline"
                  onClick={() => {navigate(`/Home_seller/Productdetlai`);handleselectedProd(product)}}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
