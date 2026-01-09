import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Lock, 
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Modal from '../../components/common/Modal';
import { useModal } from '../../hooks/useModal';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { modal, showSuccess, showError, closeModal } = useModal();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe', 'card', 'cash_on_delivery'
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch cart
        const cartResponse = await axios.get(buildApiUrl("/cart/"));
        setCart(cartResponse.data);

        // Fetch client data for address
        try {
          const clientResponse = await axios.get(buildApiUrl("/client/profile"));
          setClientData(clientResponse.data);
        } catch (err) {
          console.error('Failed to fetch client data:', err);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        setError(error.response?.data?.message || 'Erreur lors du chargement du panier');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      showError('Votre panier est vide', 'Panier vide');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Create order
      const orderResponse = await axios.post(buildApiUrl("/order"), {});
      const responseData = orderResponse.data;
      
      console.log('Order creation response:', responseData);
      console.log('Order creation status:', orderResponse.status);
      
      // Check if there's an error message
      if (responseData.message && responseData.message !== "Order created successfully") {
        throw new Error(responseData.message);
      }
      
      // The backend returns { message: "...", order: {...} }
      const order = responseData.order || responseData;

      if (!order || !order.id_order) {
        console.error('Invalid order response:', { order, responseData, status: orderResponse.status });
        throw new Error(responseData.message || 'Erreur lors de la création de la commande');
      }

      const orderId = order.id_order;

      // Process payment based on method
      if (paymentMethod === 'cash_on_delivery') {
        // For cash on delivery, create payment with pending status
        await axios.post(buildApiUrl("/payment/order/${orderId}"), {
          method: 'cash_on_delivery'
        });
        
        // Navigate to success page
        navigate(`/checkout/success?orderId=${orderId}`);
      } else if (paymentMethod === 'stripe') {
        // Create Stripe checkout session and redirect
        // Note: Stripe doesn't support MAD, using USD as fallback
        // You may want to convert the amount or use a different payment provider for MAD
        const stripeResponse = await axios.post(buildApiUrl("/payment/stripe/create-checkout"), {
          order_id: orderId,
          amount: total,
          currency: 'usd' // Stripe doesn't support MAD, using USD
        });
        
        if (stripeResponse.data.payment_url) {
          // Redirect to Stripe Checkout
          window.location.href = stripeResponse.data.payment_url;
        } else {
          throw new Error('Stripe checkout URL not received');
        }
      } else if (paymentMethod === 'card') {
        // For card payment (Stripe or saved card)
        navigate(`/checkout/payment?orderId=${orderId}&method=card`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      // Extract error message
      let errorMessage = 'Erreur lors du traitement de la commande';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
          <button
            onClick={() => navigate('/Home_client/Productlist_client')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.total || 0;
  const shipping = subtotal > 500 ? 0 : 30; // Free shipping over 500 DH
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-indigo-600 transition-colors">
                Accueil
              </button>
            </li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-gray-900 font-medium">Checkout</li>
          </ol>
        </nav>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h2>
              <div className="space-y-4">
                {cart.items.map((item) => {
                  const product = item.product;
                  const productImage = product?.images?.[0]?.imageURL || 
                                     product?.image || 
                                     'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                  const imageUrl = productImage.startsWith('http') 
                    ? productImage 
                    : buildUploadUrl("${productImage}");

                  return (
                    <div key={item.id_cart_item} className="flex gap-4 border-b pb-4 last:border-0">
                      <img
                        src={imageUrl}
                        alt={product?.product_name || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product?.product_name}</h3>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        <p className="text-lg font-bold text-indigo-600 mt-1">
                          {((product?.price || 0) * item.quantity).toFixed(2)} DH
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Adresse de livraison
              </h2>
              {clientData?.adress ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{clientData.adress}</p>
                  <button
                    onClick={() => navigate('/Profile_client')}
                    className="text-indigo-600 text-sm mt-2 hover:underline"
                  >
                    Modifier l'adresse
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 mb-2">Aucune adresse enregistrée</p>
                  <button
                    onClick={() => navigate('/Profile_client')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Ajouter une adresse
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Paiement sécurisé
              </h2>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Carte bancaire (Stripe)</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Carte enregistrée</span>
                </label>

                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">Paiement à la livraison</span>
                </label>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} DH`}</span>
                </div>
                {subtotal < 500 && (
                  <p className="text-sm text-indigo-600">
                    Ajoutez {(500 - subtotal).toFixed(2)} DH pour une livraison gratuite
                  </p>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing || !clientData?.adress}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  processing || !clientData?.adress
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Confirmer la commande
                  </>
                )}
              </button>

              {!clientData?.adress && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Veuillez ajouter une adresse de livraison
                </p>
              )}
            </div>
          </div>
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

export default CheckoutPage;
