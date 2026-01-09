import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Package, Truck, Home, FileText, Loader2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { buildApiUrl, buildUploadUrl } from '../../utils/api';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(buildApiUrl("/order/${orderId}"));
        setOrder(response.data);

        // If we have a session_id from Stripe, verify the payment
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
          try {
            await axios.get(buildApiUrl("/payment/stripe/verify/${sessionId}"));
            // Payment verification successful (webhook should have already updated it)
          } catch (error) {
            console.error('Failed to verify Stripe payment:', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600">Merci pour votre achat. Votre commande a été enregistrée avec succès.</p>
          {order && (
            <p className="text-lg font-semibold text-indigo-600 mt-2">
              Numéro de commande: #{order.id_order || order.id}
            </p>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Détails de la commande
            </h2>
            
            <div className="space-y-4 mb-6">
              {order.items && order.items.map((item) => {
                const product = item.product;
                const productImage = product?.images?.[0]?.imageURL || 
                                   product?.image || 
                                   'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                const imageUrl = productImage.startsWith('http') 
                  ? productImage 
                  : buildUploadUrl("${productImage}");

                return (
                  <div key={item.id_order_item} className="flex gap-4 border-b pb-4 last:border-0">
                    <img
                      src={imageUrl}
                      alt={product?.product_name || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product?.product_name}</h3>
                      <p className="text-sm text-gray-600">Quantité: {item.order_item_quantity}</p>
                      <p className="text-lg font-bold text-indigo-600 mt-1">
                        {((item.order_item_price || 0) * item.order_item_quantity).toFixed(2)} DH
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {(order.total_amount || 0).toFixed(2)} DH
                </span>
              </div>
              {order.payment && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Méthode de paiement:</span> {
                      order.payment.method === 'card' ? 'Carte bancaire (Stripe)' :
                      order.payment.method === 'cash_on_delivery' ? 'Paiement à la livraison' :
                      order.payment.method
                    }
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Statut:</span> {
                      order.payment.payment_status === 'succes' ? 'Payé' :
                      order.payment.payment_status === 'pending' ? 'En attente' :
                      order.payment.payment_status === 'failed' ? 'Échec' :
                      order.payment.payment_status
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Prochaines étapes
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Vous recevrez un email de confirmation sous peu</li>
            <li>• Nous traiterons votre commande dans les 24 heures</li>
            <li>• Vous serez notifié lorsque votre commande sera expédiée</li>
            <li>• Suivez votre commande depuis votre profil</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/Profile_client')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
          >
            <FileText className="w-5 h-5" />
            Voir mes commandes
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
