import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, ShoppingBag, Heart, Star, MessageCircle, 
  CreditCard, Edit, ChevronRight, Package, Calendar, DollarSign, 
  TrendingUp, FileText, Trash2, Plus, Eye, EyeOff, X
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

const ClientProfile = ({ handleSelectedClient }) => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [paymentCards, setPaymentCards] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    wishlistCount: 0,
    averageRating: 0,
    reviewsCount: 0,
    totalSpent: 0,
    profileCompletion: 0
  });

  // Form states
  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    card_number: '',
    card_holder_name: '',
    expiry_date: '',
    cvv: '',
    is_default: false
  });
  const [showCvv, setShowCvv] = useState(false);
  
  // Profile edit modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: ''
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = (clientInfo, cards) => {
    if (!clientInfo) return;
    
    let completion = 0;
    // Personal info: 60% total
    if (clientInfo.fullName && clientInfo.fullName.trim()) completion += 15;
    if (clientInfo.email && clientInfo.email.trim()) completion += 15;
    if (clientInfo.phoneNumber && clientInfo.phoneNumber.trim()) completion += 15;
    if (clientInfo.address && clientInfo.address.trim()) completion += 15;
    
    // Payment card: 20% if at least one card exists
    if (cards && cards.length > 0) completion += 20;
    
    // Profile picture: 20% (not implemented yet)
    // if (clientInfo.picture && clientInfo.picture.trim()) completion += 20;
    
    setStats(prev => ({ ...prev, profileCompletion: Math.min(completion, 100) }));
  };

  useEffect(() => {
    fetchClientData();
    fetchOrders();
    fetchReviews();
    fetchPaymentCards();
    fetchStatistics();
  }, []);

  const fetchClientData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/client/profile"));
      const client = response.data;

      // Use total_spent from backend if available (calculated from delivered orders)
      if (client.stats && client.stats.total_spent !== undefined) {
        console.log('Backend total_spent:', client.stats.total_spent);
        setStats(prev => ({ ...prev, totalSpent: parseFloat(client.stats.total_spent) || 0 }));
      }

      const normalized = {
        id: client.id_user,
        fullName: client.full_name || '',
        email: client.email || '',
        phoneNumber: client.phone || '',
        address: client.adress || '',
        picture: '',
      };

      if (handleSelectedClient) {
        handleSelectedClient(normalized);
      }

      setClientData(normalized);
      setProfileForm({
        fullName: normalized.fullName,
        email: normalized.email,
        phoneNumber: normalized.phoneNumber,
        address: normalized.address,
        password: ''
      });
      
      // Calculate profile completion will be done in useEffect
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/order/"));
      setOrders(Array.isArray(response.data) ? response.data : []);
      
      // Calculate total spent - only delivered orders (livré suffisant, pas besoin de vérifier payment_status)
      const total = response.data.reduce((sum, order) => {
        if (order.order_status === 'delivered') {
          return sum + (parseFloat(order.total_amount) || 0);
        }
        return sum;
      }, 0);
      
      console.log('Orders fetched:', response.data);
      console.log('Calculated total spent from orders:', total);
      console.log('Orders filtered (delivered):', response.data.filter(o => o.order_status === 'delivered'));
      
      // Update total spent only if orders were successfully fetched
      setStats(prev => {
        const newStats = { ...prev, totalOrders: response.data.length, totalSpent: total };
        console.log('Updating stats with totalSpent:', newStats.totalSpent);
        return newStats;
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/review/my-reviews"));
      const reviewsData = Array.isArray(response.data) ? response.data : [];
      setReviews(reviewsData);
      
      // Calculate average rating
      if (reviewsData.length > 0) {
        const avgRating = reviewsData.reduce((sum, review) => {
          return sum + (parseFloat(review.rating_review) || 0);
        }, 0) / reviewsData.length;
        
        setStats(prev => ({ 
          ...prev, 
          reviewsCount: reviewsData.length, 
          averageRating: avgRating 
        }));
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchPaymentCards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(buildApiUrl("/client/payment-cards"));
      const cardsData = Array.isArray(response.data) ? response.data : [];
      setPaymentCards(cardsData);
      // Profile completion will be updated automatically by useEffect
    } catch (err) {
      // If endpoint doesn't exist yet, just set empty array
      console.log('Payment cards endpoint not available yet');
      setPaymentCards([]);
      // Profile completion will be updated automatically by useEffect
    }
  };

  // Update completion when clientData or paymentCards change
  useEffect(() => {
    if (clientData) {
      calculateProfileCompletion(clientData, paymentCards);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData?.fullName, clientData?.email, clientData?.phoneNumber, clientData?.address, paymentCards?.length]);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch wishlist count from backend
      try {
        const wishlistRes = await axios.get(buildApiUrl("/wishlist/count"));
        setStats(prev => ({ ...prev, wishlistCount: wishlistRes.data.count || 0 }));
      } catch (wishlistErr) {
        console.error('Error fetching wishlist count:', wishlistErr);
        setStats(prev => ({ ...prev, wishlistCount: 0 }));
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      if (editingCard) {
        await axios.put(buildApiUrl("/client/payment-cards/${editingCard.id_payment_card}"), cardForm);
        alert('Carte mise à jour avec succès');
      } else {
        await axios.post(buildApiUrl("/client/payment-cards"), cardForm);
        showSuccess('Carte ajoutée avec succès');
      }
      
      setShowCardForm(false);
      setEditingCard(null);
      setCardForm({ card_number: '', card_holder_name: '', expiry_date: '', cvv: '', is_default: false });
      await fetchPaymentCards(); // This will recalculate completion
    } catch (err) {
      console.error('Error saving card:', err);
      showError(err.response?.data?.message || 'Erreur lors de la sauvegarde de la carte');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.delete(buildApiUrl("/client/payment-cards/${cardId}"));
      showSuccess('Carte supprimée avec succès');
      await fetchPaymentCards(); // This will recalculate completion
    } catch (err) {
      console.error('Error deleting card:', err);
      showError('Erreur lors de la suppression de la carte');
    }
  };

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
      };

      if (profileForm.password) {
        data.password = profileForm.password;
      }

      await axios.put(buildApiUrl("/client/profile"), data);
      showSuccess('Profil mis à jour avec succès !');
      setShowProfileModal(false);
      await fetchClientData(); // Refresh client data and recalculate completion
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    return '**** **** **** ' + cleaned.slice(-4);
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

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center text-gray-600">Aucune donnée client trouvée.</div>
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
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
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
            Bon retour, {clientData.fullName.split(' ')[0] || 'Client'} !
          </h1>
          <p className="text-indigo-100 text-lg">
            Gérez votre profil et consultez les détails de votre compte
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Commandes
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-pink-600 mb-1">{stats.wishlistCount}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Liste de souhaits
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0'}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Note moyenne
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {(() => {
                const total = stats.totalSpent || 0;
                console.log('Displaying total spent:', total, 'from stats:', stats);
                return `${total.toFixed(2)} DH`;
              })()}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total dépensé
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">{stats.reviewsCount}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Commentaires
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
                  <div className="text-gray-900 font-medium">{clientData.fullName || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <div className="text-gray-900 font-medium">{clientData.email || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Téléphone</div>
                  <div className="text-gray-900 font-medium">{clientData.phoneNumber || 'Non spécifié'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Adresse</div>
                  <div className="text-gray-900 font-medium">{clientData.address || 'Non spécifiée'}</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setProfileForm({
                  fullName: clientData.fullName || '',
                  email: clientData.email || '',
                  phoneNumber: clientData.phoneNumber || '',
                  address: clientData.address || '',
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

          {/* Payment Cards */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-indigo-600" />
                Cartes de paiement
              </h3>
              <button
                onClick={() => {
                  setEditingCard(null);
                  setCardForm({ card_number: '', card_holder_name: '', expiry_date: '', cvv: '', is_default: false });
                  setShowCardForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            {showCardForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">
                  {editingCard ? 'Modifier la carte' : 'Nouvelle carte'}
                </h4>
                <form onSubmit={handleSaveCard} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                    <input
                      type="text"
                      value={cardForm.card_number}
                      onChange={(e) => setCardForm({ ...cardForm, card_number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulaire de la carte</label>
                    <input
                      type="text"
                      value={cardForm.card_holder_name}
                      onChange={(e) => setCardForm({ ...cardForm, card_holder_name: e.target.value })}
                      placeholder="NOM PRÉNOM"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                      <input
                        type="text"
                        value={cardForm.expiry_date}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setCardForm({ ...cardForm, expiry_date: value });
                        }}
                        placeholder="MM/AA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <div className="relative">
                        <input
                          type={showCvv ? "text" : "password"}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          maxLength={4}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCvv(!showCvv)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={cardForm.is_default}
                      onChange={(e) => setCardForm({ ...cardForm, is_default: e.target.checked })}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="is_default" className="text-sm text-gray-700">
                      Définir comme carte par défaut
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                    >
                      {editingCard ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCardForm(false);
                        setEditingCard(null);
                        setCardForm({ card_number: '', card_holder_name: '', expiry_date: '', cvv: '', is_default: false });
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            )}

            {paymentCards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Aucune carte enregistrée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentCards.map((card) => (
                  <div key={card.id_payment_card} className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white relative">
                    {card.is_default && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                        Défaut
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-lg font-bold mb-1">{card.card_holder_name}</div>
                        <div className="text-sm opacity-90">{maskCardNumber(card.card_number)}</div>
                      </div>
                      <CreditCard className="w-8 h-8 opacity-80" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Exp: {card.expiry_date}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCard(card);
                            setCardForm({
                              card_number: card.card_number,
                              card_holder_name: card.card_holder_name,
                              expiry_date: card.expiry_date,
                              cvv: '',
                              is_default: card.is_default
                            });
                            setShowCardForm(true);
                          }}
                          className="px-3 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id_payment_card)}
                          className="px-3 py-1 bg-red-500/80 rounded hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Historique des commandes
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucune commande pour le moment</p>
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
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.order_status === 'delivered' ? 'Livré' :
                         order.order_status === 'shipped' ? 'Expédié' :
                         order.order_status === 'processing' ? 'En traitement' :
                         'Annulé'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="text-sm font-semibold text-gray-700 mb-3">Articles commandés :</div>
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

        {/* Reviews History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            Historique des commentaires
          </h3>
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Aucun commentaire pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id_review} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStars(review.rating_review)}
                        <span className="text-sm font-medium text-gray-700">
                          {review.rating_review}/5
                        </span>
                      </div>
                      {review.commentt && (
                        <p className="text-gray-700 mb-3">{review.commentt}</p>
                      )}
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.review_createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
};

export default ClientProfile;
