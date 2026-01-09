import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { Heart, ChevronRight, ChevronLeft, LayoutGrid, List, Star, ShoppingCart, Search, Filter as FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';

export default function ProductList({ handleselectedProd }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Products state - chargés depuis le backend avec filtres SQL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 24,
    total_pages: 0,
    has_next: false,
    has_prev: false
  });
  
  // Filter states - utilisés pour construire la requête SQL backend
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // null, 'available'
  const [selectedRating, setSelectedRating] = useState(null); // null or rating number (1-5)
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  
  // Sorting and pagination
  const [sortBy, setSortBy] = useState('price_asc');
  const [productsPerPage, setProductsPerPage] = useState(24);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Load wishlist from backend (cart is now loaded in Navbar)
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('http://127.0.0.1:8080/api/wishlist/');
        setWishlist(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        setWishlist([]);
      }
    };

    fetchWishlist();

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  // Fetch categories with subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axios.get("http://127.0.0.1:8080/api/category");
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
        
        // Récupérer les marques depuis le backend (on peut créer un endpoint ou utiliser les produits)
        // Pour l'instant, on va récupérer quelques produits pour obtenir les marques
        try {
          const brandsRes = await axios.get("http://127.0.0.1:8080/api/product/search?limit=1000");
          if (brandsRes.data && brandsRes.data.products) {
            const uniqueBrands = [...new Set(brandsRes.data.products.map(p => p.brand).filter(Boolean))];
            setBrands(uniqueBrands.sort());
            
            // Calculer le prix max
            const prices = brandsRes.data.products.map(p => parseFloat(p.price) || 0);
            if (prices.length > 0) {
              const max = Math.max(...prices);
              setMaxPrice(Math.ceil(max / 100) * 100);
              setPriceRange([0, Math.ceil(max / 100) * 100]);
            }
          }
        } catch (e) {
          console.error("Failed to load brands:", e);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);


  // Fonction principale pour charger les produits avec tous les filtres SQL côté backend
  const fetchProductsWithFilters = async () => {
    try {
      setLoading(true);
      
      // Construire les paramètres de requête pour l'API backend
      const params = new URLSearchParams();
      
      // 1. Recherche (nom, marque, description)
      if (searchQuery && searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      // 2. Catégories (IDs)
      if (selectedCategories.length > 0) {
        // Convertir les noms de catégories en IDs
        const categoryIds = selectedCategories
          .map(catName => {
            const cat = categories.find(c => c.category_name === catName);
            return cat ? cat.id_category : null;
          })
          .filter(Boolean);
        
        if (categoryIds.length > 0) {
          params.append('category_ids', categoryIds.join(','));
        }
      }
      
      // 3. Sous-catégories (IDs)
      if (selectedSubcategories.length > 0) {
        const subcategoryIds = selectedSubcategories
          .map(subName => {
            for (const cat of categories) {
              const sub = cat.subcategories?.find(s => s.SubCategory_name === subName);
              if (sub) return sub.id_SubCategory;
            }
            return null;
          })
          .filter(Boolean);
        
        if (subcategoryIds.length > 0) {
          params.append('subcategory_ids', subcategoryIds.join(','));
        }
      }
      
      // 4. Prix
      if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
      }
      
      // 5. Disponibilité
      if (selectedAvailability === 'available') {
        params.append('stock', 'available');
      }
      
      // 6. Note minimale
      if (selectedRating) {
        params.append('minRating', selectedRating.toString());
      }
      
      // 7. Marques (plusieurs marques séparées par des virgules)
      if (selectedBrands.length > 0 && !searchQuery) {
        // Si plusieurs marques, les séparer par des virgules
        params.append('brands', selectedBrands.join(','));
      }
      
      // 8. Tri
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      // 9. Pagination
      params.append('page', currentPage.toString());
      params.append('perPage', productsPerPage.toString());
      
      // Appel API avec tous les filtres - tout le filtrage est fait en SQL côté backend
      const response = await axios.get(`http://127.0.0.1:8080/api/product/search?${params.toString()}`);
      
      if (response.data) {
        // Le backend retourne { products: [], pagination: {} }
        if (response.data.products) {
          setProducts(response.data.products);
          setPagination(response.data.pagination || {
            total: response.data.products.length,
            page: currentPage,
            per_page: productsPerPage,
            total_pages: 1,
            has_next: false,
            has_prev: false
          });
        } else if (Array.isArray(response.data)) {
          // Compatibilité avec l'ancien format
          setProducts(response.data);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showError('Erreur lors du chargement des produits', 'Erreur');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits quand les filtres changent
  useEffect(() => {
    fetchProductsWithFilters();
  }, [
    searchQuery,
    selectedCategories,
    selectedSubcategories,
    priceRange,
    selectedAvailability,
    selectedRating,
    selectedBrands,
    sortBy,
    currentPage,
    productsPerPage
  ]);

  // Handle filters - maintenant ils déclenchent juste un rechargement depuis le backend
  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryName) => {
    const newCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter(c => c !== categoryName)
      : [...selectedCategories, categoryName];
    setSelectedCategories(newCategories);
    setCurrentPage(1);
    // Réinitialiser les sous-catégories si la catégorie est désélectionnée
    if (!newCategories.includes(categoryName)) {
      setSelectedSubcategories([]);
    }
  };

  const handleSubcategoryToggle = (subcategoryName) => {
    const newSubcategories = selectedSubcategories.includes(subcategoryName)
      ? selectedSubcategories.filter(s => s !== subcategoryName)
      : [...selectedSubcategories, subcategoryName];
    setSelectedSubcategories(newSubcategories);
    setCurrentPage(1);
  };

  const handlePriceChange = (values) => {
    setPriceRange(values);
    setCurrentPage(1);
  };

  const handleAvailabilityChange = (availability) => {
    setSelectedAvailability(availability === selectedAvailability ? null : availability);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    const newValue = selectedRating === rating ? null : rating;
    setSelectedRating(newValue);
    setCurrentPage(1);
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
      
      // Dispatch custom event to notify Navbar and other components
      window.dispatchEvent(new Event('wishlistUpdated'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour de la liste de souhaits');
    }
  };

  // Les produits sont déjà filtrés et paginés côté backend via requêtes SQL
  // Pas de filtrage frontend - tout est fait dans la base de données MySQL
  const displayedProducts = products; // Produits déjà filtrés et triés par le backend
  
  // Utiliser la pagination du backend
  const totalPages = pagination.total_pages || 1;
  
  // S'assurer que currentPage ne dépasse pas totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < Math.floor(numRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryName) => {
    const category = categories.find(c => c.category_name === categoryName);
    return category?.subcategories || [];
  };

  // Handle URL parameters for initial filtering
  // Handle URL parameters for initial filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam && !selectedCategories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
      setCurrentPage(1);
      // fetchProductsWithFilters sera déclenché automatiquement via useEffect sur selectedCategories
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
      setCurrentPage(1);
      // fetchProductsWithFilters sera déclenché automatiquement via useEffect sur searchQuery
    } else {
      setSearchQuery('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-sm"
        >
          <ol className="flex items-center gap-2 text-gray-600">
            <li><button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">Accueil</button></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Tous les Produits</li>
          </ol>
        </motion.nav>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, marque ou description..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-64 flex-shrink-0 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <FilterIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filtrer</h3>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Max"
                  />
                            </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb ${(priceRange[1] / maxPrice) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{priceRange[0]} DH</span>
                  <span>{priceRange[1]} DH</span>
                </div>
              </div>
                          </div>

            {/* Brands Filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabricants</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{brand}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({products.filter(p => p.brand === brand).length})
                      </span>
                    </label>
                        ))}
                      </div>
              </div>
            )}

            {/* Categories Filter */}
            {!loadingCategories && categories.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id_category}>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.category_name)}
                          onChange={() => handleCategoryToggle(category.category_name)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{category.category_name}</span>
                        <span className="ml-auto text-xs text-gray-500">
                          {/* Le compteur est géré côté backend - optionnel */}
                        </span>
                      </label>
                      {/* Subcategories - Only show when category is selected */}
                      {selectedCategories.includes(category.category_name) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {getSubcategoriesForCategory(category.category_name).length > 0 ? (
                            getSubcategoriesForCategory(category.category_name).map((subcat) => {
                              return (
                                <label key={subcat.id_SubCategory} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-indigo-600">
                                  <input
                                    type="checkbox"
                                    checked={selectedSubcategories.includes(subcat.SubCategory_name)}
                                    onChange={() => handleSubcategoryToggle(subcat.SubCategory_name)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span>{subcat.SubCategory_name}</span>
                                </label>
                              );
                            })
                          ) : (
                            <div className="text-xs text-gray-400 italic pl-6">Aucune sous-catégorie disponible</div>
                          )}
                        </div>
                      )}
                      </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilité</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600">
                  <input
                    type="checkbox"
                    checked={selectedAvailability === 'available'}
                    onChange={() => {
                      if (selectedAvailability === 'available') {
                        handleAvailabilityChange(null);
                      } else {
                        handleAvailabilityChange('available');
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Disponible</span>
                  {/* Le compteur est géré côté backend - optionnel */}
                </label>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  return (
                    <label key={rating} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-indigo-600">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-1">et plus</span>
                      </div>
                      {/* Le compteur est géré côté backend - optionnel */}
                    </label>
                  );
                })}
                {selectedRating && (
                  <button 
                    onClick={() => handleRatingChange(null)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 mt-1"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar - Count, Sort, View Mode, Items per page */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Il y a <span className="font-semibold text-gray-900">{pagination.total || displayedProducts.length}</span> {(pagination.total || displayedProducts.length) === 1 ? 'produit' : 'produits'}.
              </div>
                
                <div className="flex items-center gap-4">
                  {/* View Mode */}
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Trier par :</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="price_asc">Prix croissants</option>
                      <option value="price_desc">Prix décroissants</option>
                      <option value="name_asc">Nom A-Z</option>
                      <option value="name_desc">Nom Z-A</option>
                      <option value="rating_desc">Meilleures notes</option>
                    </select>
                  </div>
                  
                  {/* Items per page */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Afficher :</label>
                    <select
                      value={productsPerPage}
                      onChange={(e) => {
                        setProductsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="12">12</option>
                      <option value="24">24</option>
                      <option value="48">48</option>
                      <option value="96">96</option>
                    </select>
                  </div>
                </div>
                  </div>
                  
              {/* Display range */}
              <div className="mt-2 text-xs text-gray-500">
                Affichage {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, pagination.total || displayedProducts.length)} De {pagination.total || displayedProducts.length} Article{(pagination.total || displayedProducts.length) > 1 ? 's' : ''}
              </div>
            </div>

            {/* Products Grid/List */}
            {displayedProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                {displayedProducts.map((product) => {
                  const productId = product.id || product.id_product;
                  const productName = product.name || product.product_name;
                  const productPrice = parseFloat(product.price) || 0;
                  const productImage = product.image || product.imageURL || product.images?.[0]?.imageURL || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                  const productDescription = product.description || product.product_description || 'Aucune description disponible';
                  const isInWishlist = wishlist.find(w => (w.id || w.id_product) === productId);
                  const isAvailable = product.available !== false && (product.stock || 0) > 0;

                  return (
                    <motion.div
                      key={productId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100 ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                    >
                      {/* Product Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'w-full h-48'}`}>
                        <img
                          src={productImage}
                          alt={productName}
                          className={`${viewMode === 'list' ? 'h-full' : 'h-full'} w-full object-cover`}
                        />
                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">SOLD OUT</span>
                          </div>
                        )}
                        <button 
                          onClick={() => handleAddToWishlist(product)}
                          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                            isInWishlist
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{productName}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{productDescription}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(product.rating || 0)}
                          <span className="text-xs text-gray-500">({product.rating || 0}/5)</span>
                    </div>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-xl font-bold text-red-600">
                            {productPrice.toFixed(2)} DH
                          </span>
                          {product.promo > 0 && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              {(productPrice / (1 - product.promo / 100)).toFixed(2)} DH
                            </span>
                          )}
                        </div>
                  
                  {/* Actions */}
                        <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => handleAddToCart(product)}
                            disabled={!isAvailable}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                              isAvailable
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Ajouter
                            </button>
                    <button 
                      onClick={() => {
                        navigate(`/Productlist/ProductDetlail/${productId}`);
                        handleselectedProd(product);
                      }}
                            className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transition-colors"
                    >
                            Détails
                    </button>
                  </div>
                </div>
              </motion.div>
                  );
                })}
          </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">Aucun produit trouvé.</p>
        </div>
            )}

            {/* Pagination - Always show pagination */}
            {totalPages > 0 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
        <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
        </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                >
                  <ChevronRight className="w-5 h-5" />
</button>
      </div>
            )}
          </main>
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
