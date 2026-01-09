import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Calendar, 
  User, 
  DollarSign, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import Navbar from '../../components/layout/Navbar';

const Orders = () => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal, showConfirm } = useModal();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8080/api/seller/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showError('Vous devez être connecté pour voir vos commandes', 'Accès refusé', () => {
          navigate('/login');
        });
      } else {
        showError('Erreur lors du chargement des commandes');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/api/seller/orders/${orderId}/status`,
        { order_status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        showSuccess(`Statut de la commande mis à jour: ${getStatusLabel(newStatus)}`);
        // Update local state
        setOrders(orders.map(order => 
          order.id_order === orderId 
            ? { ...order, order_status: newStatus }
            : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      showError(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    }
  };


  const getStatusLabel = (status) => {
    const labels = {
      'processing': 'En traitement',
      'shipped': 'Expédié',
      'delivered': 'Livré',
      'cancelled': 'Annulé',
      'pending': 'En attente',
      'paid': 'Payé',
      'failed': 'Échoué'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'processing': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'shipped': 'bg-blue-100 text-blue-800 border-blue-300',
      'delivered': 'bg-green-100 text-green-800 border-green-300',
      'cancelled': 'bg-red-100 text-red-800 border-red-300',
      'pending': 'bg-gray-100 text-gray-800 border-gray-300',
      'paid': 'bg-green-100 text-green-800 border-green-300',
      'failed': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const transitions = {
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': [], // No transitions from delivered
      'cancelled': [] // No transitions from cancelled
    };
    return transitions[currentStatus] || [];
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === filterStatus);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <li className="text-gray-900 font-medium">Mes Commandes</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Mes Commandes</h1>
              <p className="text-indigo-100">Gérez les commandes de vos produits</p>
            </div>
          </div>
        </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'processing'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            En traitement ({orders.filter(o => o.order_status === 'processing').length})
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'shipped'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Expédiées ({orders.filter(o => o.order_status === 'shipped').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'delivered'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Livrées ({orders.filter(o => o.order_status === 'delivered').length})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Annulées ({orders.filter(o => o.order_status === 'cancelled').length})
          </button>
        </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-2">Aucune commande trouvée</p>
          <p className="text-gray-500">
            {filterStatus === 'all' 
              ? 'Vous n\'avez pas encore reçu de commandes'
              : `Aucune commande avec le statut "${getStatusLabel(filterStatus)}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id_order}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          Commande #{order.id_order}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                          {getStatusIcon(order.order_status)}
                          {getStatusLabel(order.order_status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.payment_status)}`}>
                          {getStatusLabel(order.payment_status)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(order.order_createdAt)}
                        </div>
                        {order.client && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {order.client.full_name || order.client.username || 'Client'}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {order.seller_total ? `${parseFloat(order.seller_total).toFixed(2)} DH` : `${parseFloat(order.total_amount || 0).toFixed(2)} DH`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getNextStatusOptions(order.order_status).length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              updateOrderStatus(order.id_order, e.target.value);
                              e.target.value = ''; // Reset select
                            }
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                          defaultValue=""
                        >
                          <option value="">Mettre à jour...</option>
                          {getNextStatusOptions(order.order_status).map(status => (
                            <option key={status} value={status}>
                              {getStatusLabel(status)}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id_order ? null : order.id_order)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedOrder === order.id_order ? (
                          <ChevronUp className="w-5 h-5 text-gray-700" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items (Expandable) */}
                <AnimatePresence>
                  {expandedOrder === order.id_order && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-4">Articles de la commande:</h4>
                        <div className="space-y-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-4"
                              >
                                {item.product?.images?.[0]?.imageURL ? (
                                  <img
                                    src={item.product.images[0].imageURL}
                                    alt={item.product.product_name || 'Produit'}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src = 'https://via.placeholder.com/64';
                                    }}
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800">
                                    {item.product?.product_name || 'Produit'}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    Quantité: {item.order_item_quantity || item.quantity || 1}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-800">
                                    {parseFloat(item.order_item_price || item.price || 0).toFixed(2)} DH
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Sous-total: {((item.order_item_price || item.price || 0) * (item.order_item_quantity || item.quantity || 1)).toFixed(2)} DH
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-center py-4">Aucun article trouvé</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      )}
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
};

export default Orders;
