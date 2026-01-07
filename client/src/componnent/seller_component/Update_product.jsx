import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function update_product({selectedprod,fetchProducts}) {
  const navigate = useNavigate();
  const [name, setName] = useState(selectedprod.name);
  const [description, setDescription] = useState(selectedprod.description);
  const [state, setState] = useState(selectedprod.state);
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState(selectedprod.price);
  const [available, setAvailable] = useState(selectedprod.available);
  const [brand, setBrand] = useState(selectedprod.brand);
  const [rate, setRate] = useState(selectedprod.rate);
  const [quantity, setQuantity] = useState(selectedprod.quantity);
  const [negociable, setNegociable] = useState(selectedprod.negociable);
  const [promo, setPromo] = useState(selectedprod.promo);
  const [delivered, setDelivered] = useState(selectedprod.delivered);
  const [addToWishlist, setAddToWishlist] = useState(selectedprod.addToWishlist);
//   const [makeOffer, setMakeOffer] = useState(false);
 const [image, setimage] = useState(selectedprod.image);
 const [category,setCategorie]=useState(selectedprod.category)



  // useEffect(() => {
  //   if (!negociable) setMakeOffer(false);
  // }, [negociable]);

 const saveProduct = async () => {
  try {
    // Step 1: Create product
    const productRes = await axios.put(`http://127.0.0.1:8080/api/product/update/${selectedprod.id}`, {
      name,
      description,
      state,
      date,
      price,
      available,
      brand,
      rate,
      quantity,
      negociable,
      promo,
      delivered,
      addToWishlist,
      image,
      category
    });


  } catch (error) {
    console.error("Error:", error.message);
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct();
    alert("Product and image updated successfully!");
    fetchProducts()
    navigate("/Home_seller/my_products")

  };

// Navigation
  const handleMyProducts = () => navigate("/Home_seller/my_products");
  const handleAddProduct = () => navigate("/Home_seller/add_product");
  const handleProfile = () => navigate("/Home_seller/profile");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/Home_seller");
  };

  return (
    <div>
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

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
<div>
  <label className="block text-sm font-medium text-gray-700">
    Product Category
  </label>
  <select
    value={category}
    onChange={(e) => setCategorie(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  >
    <option value="">Select a category</option>
    <option value="Laptop">Laptop</option>
    <option value="Phone">Phone</option>
    <option value="TV">TV</option>
    <option value="Accessories">Accessories</option>
    <option value="Others">Others</option>
  </select>
</div>
                        <div>
              <label className="block text-sm font-medium text-gray-700">
                Product image
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setimage(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              ></textarea>
            </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    State
  </label>
  <select
    value={state}
    onChange={(e) => setState(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  >
    <option value="">Select product condition</option>
    <option value="new">New</option>
    <option value="used">Used</option>
  </select>
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={date.toISOString().split("T")[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
           <input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => setimage(Array.from(e.target.files))}
  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
/>

            </div> */}

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
                <span>Available</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={delivered}
                  onChange={(e) => setDelivered(e.target.checked)}
                />
                <span>Delivered</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={addToWishlist}
                  onChange={(e) => setAddToWishlist(e.target.checked)}
                />
                <span>Add to Wishlist</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={negociable}
                  onChange={(e) => setNegociable(e.target.checked)}
                />
                <span>Negotiable</span>
              </label>

              {/* <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={makeOffer}
                  onChange={(e) => setMakeOffer(e.target.checked)}
                  disabled={!negociable}
                />
                <span>Make Offer</span>
              </label> */}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

<div>
  <label className="block text-sm font-medium text-gray-700">
    Rate
  </label>
  <input
    type="number"
    min="1"
    max="5"
    step="1"
    value={rate}
    onChange={(e) => setRate(parseFloat(e.target.value))}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
  />
</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Promo (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={promo}
                  onChange={(e) => setPromo(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

