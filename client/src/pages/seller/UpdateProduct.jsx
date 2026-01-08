import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function update_product({selectedprod,fetchProducts}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [product, setProduct] = useState(selectedprod || null);
  const [name, setName] = useState(selectedprod?.name || "");
  const [description, setDescription] = useState(selectedprod?.description || "");
  const [price, setPrice] = useState(selectedprod?.price || 0);
  const [brand, setBrand] = useState(selectedprod?.brand || "");
  const [quantity, setQuantity] = useState(selectedprod?.quantity || 0);
  const [image, setimage] = useState(selectedprod?.image || "");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState(selectedprod?.id_category || "");
  const [subcategoryId, setSubcategoryId] = useState(selectedprod?.id_SubCategory || "");
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories on mount (categories API includes subcategories)
  useEffect(() => {
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
  }, []);

  // Update subcategories when category changes (extract from categories data)
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    // Find the selected category and extract its subcategories
    const selectedCategory = categories.find(
      (cat) => cat.id_category === parseInt(categoryId)
    );
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
    } else {
      setSubcategories([]);
    }
  }, [categoryId, categories]);

  // Fetch product details if id is provided
  useEffect(() => {
    if (!id || (product && product.id_product)) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8080/api/product/${id}`);
        const fetched = res.data;
        setProduct(fetched);
        setName(fetched.product_name || "");
        setDescription(fetched.product_description || "");
        setPrice(fetched.price || 0);
        setBrand(fetched.brand || "");
        setQuantity(fetched.stock || 0);
        setimage(fetched.images?.[0]?.imageURL || "");
        setCategoryId(fetched.id_category || "");
        setSubcategoryId(fetched.id_SubCategory || "");
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };
    fetchProduct();
  }, [id, product]);



  // useEffect(() => {
  //   if (!negociable) setMakeOffer(false);
  // }, [negociable]);

 const saveProduct = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("Vous devez être connecté pour mettre à jour un produit", "Connexion requise");
      return;
    }

    const productId = product?.id_product || selectedprod?.id_product || id;
    
    const updateData = {
      product_name: name,
      product_description: description,
      price: parseFloat(price),
      stock: parseInt(quantity),
      brand: brand,
      id_category: categoryId ? parseInt(categoryId, 10) : null,
      images: image ? [image] : []
    };

    // Add subcategory if selected, otherwise set to null to clear it
    if (subcategoryId) {
      updateData.id_SubCategory = parseInt(subcategoryId, 10);
    } else {
      updateData.id_SubCategory = null;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await axios.put(`http://127.0.0.1:8080/api/product/update/${productId}`, updateData);

    } catch (error) {
    console.error("Error:", error);
    showError("Erreur lors de la mise à jour du produit: " + (error.response?.data?.message || error.message));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProduct();
    showSuccess("Produit mis à jour avec succès!", "Succès", () => {
      if (fetchProducts) fetchProducts();
      navigate("/Home_seller/my_products");
    });
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
            Modifier le produit
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du produit
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
                Catégorie *
              </label>
              {loadingCategories ? (
                <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100">
                  <span className="text-gray-500">Chargement des catégories...</span>
                </div>
              ) : categories.length === 0 ? (
                <div className="mt-1 block w-full border border-red-300 rounded-md shadow-sm p-2 bg-red-50">
                  <span className="text-red-600 text-sm">
                    Aucune catégorie disponible. Contactez l'administrateur.
                  </span>
                </div>
              ) : (
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId(""); // Reset subcategory when category changes
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id_category} value={cat.id_category}>
                      {cat.category_name || 'Catégorie sans nom'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {categoryId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sous-catégorie (optionnel)
                </label>
                {subcategories.length === 0 ? (
                  <div className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50">
                    <span className="text-gray-500 text-sm italic">
                      Aucune sous-catégorie disponible pour cette catégorie
                    </span>
                  </div>
                ) : (
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Aucune sous-catégorie</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id_SubCategory} value={sub.id_SubCategory}>
                        {sub.SubCategory_name || 'Sous-catégorie sans nom'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image du produit (URL)
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
                rows="4"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix (DH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantité (Stock)
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marque
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
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

