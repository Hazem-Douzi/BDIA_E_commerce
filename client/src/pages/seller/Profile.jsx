import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Package, Star, MessageCircle, 
  Edit, ChevronRight, Calendar, DollarSign, TrendingUp, 
  ShoppingBag, BarChart3, X, Store
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

const SellerProfile = ({ handleSelectedSeller }) => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    profileCompletion: 0
  });

  // Profile edit modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    shopName: '',
    shopDescription: '',
    password: ''
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = (sellerInfo) => {
    if (!sellerInfo) return;
    
    let completion = 0;
    // Personal info: 40% total
    if (sellerInfo.fullName && sellerInfo.fullName.trim()) completion += 10;
    if (sellerInfo.email && sellerInfo.email.trim()) completion += 10;
    if (sellerInfo.phoneNumber && sellerInfo.phoneNumber.trim()) completion += 10;
    if (sellerInfo.address && sellerInfo.address.trim()) completion += 10;
    
    // Shop info: 30% total
    if (sellerInfo.shopName && sellerInfo.shopName.trim()) completion += 15;
    if (sellerInfo.shopDescription && sellerInfo.shopDescription.trim()) completion += 15;
    
    // Shop image: 20%
    if (sellerInfo.picture && sellerInfo.picture.trim()) completion += 20;
    
    // Verification: 10%
    if (sellerInfo.verified) completion += 10;
    
    setStats(prev => ({ ...prev, profileCompletion: Math.min(completion, 100) }));
  };

  useEffect(() => {
    fetchSellerData();
    fetchSellerStats();
    fetchOrders();
  }, []);

    const fetchSellerData = async () => {
      try {
        const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/seller/profile"));
        const seller = response.data;

      const normalized = {
        id: seller.id_user,
        fullName: seller.full_name || '',
        email: seller.email || '',
        phoneNumber: seller.phone || '',
        address: seller.adress || '',
        picture: seller.seller_profile?.shop_image || '',
        shopName: seller.seller_profile?.shop_name || '',
        shopDescription: seller.seller_profile?.shop_description || '',
        verified: seller.stats?.verified || false,
      };

      if (handleSelectedSeller) {
        handleSelectedSeller(normalized);
      }

      setSellerData(normalized);
      setProfileForm({
        fullName: normalized.fullName,
        email: normalized.email,
        phoneNumber: normalized.phoneNumber,
        address: normalized.address,
        shopName: normalized.shopName,
        shopDescription: normalized.shopDescription,
        password: ''
        });
      } catch (err) {
        console.error('Error fetching seller data:', err);
      showError('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/seller/stats"));
      const statsData = response.data;

      setStats(prev => ({
        ...prev,
        totalProducts: statsData.total_products || 0,
        totalOrders: statsData.total_orders || 0,
        totalRevenue: parseFloat(statsData.total_revenue || 0),
        averageRating: parseFloat(statsData.average_rating || 0),
        pendingOrders: statsData.pending_orders || 0,
        deliveredOrders: statsData.delivered_orders || 0,
      }));
    } catch (err) {
      console.error('Error fetching seller stats:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/seller/orders"));
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Update completion when sellerData changes
  useEffect(() => {
    if (sellerData) {
      calculateProfileCompletion(sellerData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerData?.fullName, sellerData?.email, sellerData?.phoneNumber, sellerData?.address, sellerData?.shopName, sellerData?.shopDescription, sellerData?.picture, sellerData?.verified]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const data = {
        full_name: profileForm.fullName,
        phone: profileForm.phoneNumber,
        adress: profileForm.address,
        email: profileForm.email,
        shop_name: profileForm.shopName,
        shop_description: profileForm.shopDescription,
      };

      if (profileForm.password) {
        data.password = profileForm.password;
      }

      await axios.put(buildApiUrl("/seller/profile"), data);
      showSuccess('Profil mis à jour avec succès !');
      setShowProfileModal(false);
      await fetchSellerData(); // Refresh seller data and recalculate completion
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered': return 'Livré';
      case 'shipped': return 'Expédié';
      case 'processing': return 'En traitement';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Chargement du profil...</div>
        </div>
      </div>
    );
  }

  if (!sellerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Aucune donnée vendeur trouvée.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/Home_seller')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Profil</li>
          </ol>
        </nav>

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">
            Bon retour, {sellerData.fullName.split(' ')[0] || 'Vendeur'} !
          </h1>
          <p className="text-indigo-100 text-lg">
            Gérez votre profil vendeur et consultez les statistiques de votre boutique
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Commandes
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats.totalRevenue.toFixed(2)} DH
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenus
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Note moyenne
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.pendingOrders}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              En attente
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-1">{stats.profileCompletion}%</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Profil complété
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Complétion du profil</h3>
            <span className="text-sm font-medium text-indigo-600">{stats.profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Informations personnelles
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Nom complet</div>
                  <div className="text-gray-900 font-medium">{sellerData.fullName || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-gray-900 font-medium">{sellerData.email || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Téléphone</div>
                  <div className="text-gray-900 font-medium">{sellerData.phoneNumber || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Adresse</div>
                  <div className="text-gray-900 font-medium">{sellerData.address || 'Non spécifiée'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Store className="w-6 h-6 text-indigo-600" />
              Informations de la boutique
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Store className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Nom de la boutique</div>
                  <div className="text-gray-900 font-medium">{sellerData.shopName || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Description</div>
                  <div className="text-gray-900 font-medium">{sellerData.shopDescription || 'Non spécifiée'}</div>
                </div>
              </div>
              {sellerData.picture && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">Image de la boutique</div>
                    <img 
                      src={sellerData.picture} 
                      alt="Boutique"
                      className="w-24 h-24 object-cover rounded-lg mt-2"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Statut de vérification</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    sellerData.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sellerData.verified ? 'Vérifié ✓' : 'Non vérifié'}
                  </div>
                </div>
              </div>
            </div>
          <button
              onClick={() => {
                setProfileForm({
                  fullName: sellerData.fullName || '',
                  email: sellerData.email || '',
                  phoneNumber: sellerData.phoneNumber || '',
                  address: sellerData.address || '',
                  shopName: sellerData.shopName || '',
                  shopDescription: sellerData.shopDescription || '',
                  password: ''
                });
                setShowProfileModal(true);
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
            >
              <Edit className="w-5 h-5" />
              Modifier le profil
          </button>
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Historique des commandes reçues
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucune commande reçue pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id_order} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        Commande #{order.id_order}
                      </div>
                      {order.client && (
                        <div className="text-sm text-gray-600 mb-2">
                          Client: {order.client.full_name || order.client.email || 'Client'}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.order_createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-indigo-600 mb-2">
                        {parseFloat(order.total_amount || 0).toFixed(2)} DH
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.order_status)}`}>
                        {getStatusLabel(order.order_status)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3">Articles de la commande :</div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            {item.product?.images?.[0]?.imageURL && (
                              <img 
                                src={item.product.images[0].imageURL} 
                                alt={item.product.product_name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.product?.product_name || 'Produit'}</div>
                              <div className="text-sm text-gray-600">
                                Quantité: {item.order_item_quantity} × {parseFloat(item.order_item_price || 0).toFixed(2)} DH
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {(parseFloat(item.order_item_quantity || 0) * parseFloat(item.order_item_price || 0)).toFixed(2)} DH
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Modifier le profil</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez votre nom complet"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez votre email"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={profileForm.phoneNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez votre numéro de téléphone"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez votre adresse complète"
                />
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la boutique
                </label>
                <input
                  type="text"
                  value={profileForm.shopName}
                  onChange={(e) => setProfileForm({ ...profileForm, shopName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Entrez le nom de votre boutique"
                />
              </div>

              {/* Shop Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de la boutique
                </label>
                <textarea
                  value={profileForm.shopDescription}
                  onChange={(e) => setProfileForm({ ...profileForm, shopDescription: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Décrivez votre boutique"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe (optionnel)
                </label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Laissez vide pour garder le mot de passe actuel"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Laissez ce champ vide si vous ne souhaitez pas changer votre mot de passe
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
};

export default SellerProfile;
