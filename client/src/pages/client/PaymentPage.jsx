import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const method = searchParams.get('method');
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing', 'success', 'failed'
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // For Stripe, users are redirected directly to Stripe Checkout from CheckoutPage
    // This page handles cancellation returns from Stripe
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');
    
    // If payment was canceled, show error
    if (canceled === 'true') {
      setError('Paiement annulé. Vous pouvez réessayer.');
      setPaymentStatus('failed');
      setLoading(false);
      return;
    }

    // If we have a session_id, we're coming back from Stripe (shouldn't happen, but handle it)
    if (sessionId && orderId) {
      const verifyPayment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        try {
          setLoading(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await verifyStripePayment(sessionId, orderId);
        } catch (error) {
          console.error('Payment verification error:', error);
          setError('Erreur lors de la vérification du paiement');
          setPaymentStatus('failed');
          setLoading(false);
        }
      };
      verifyPayment();
      return;
    }

    // For other payment methods (like saved card)
    if (!orderId || !method) {
      navigate('/checkout');
      return;
    }

    const processPayment = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch order details
        const orderResponse = await axios.get(`http://127.0.0.1:8080/api/order/${orderId}`);
        setOrder(orderResponse.data);

        if (method === 'card') {
          await processCardPayment(orderId, orderResponse.data);
        } else {
          setError('Méthode de paiement non supportée');
          setPaymentStatus('failed');
          setLoading(false);
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        setError(error.response?.data?.message || 'Erreur lors du traitement du paiement');
        setPaymentStatus('failed');
        setLoading(false);
      }
    };

    processPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, method, navigate]);

  const verifyStripePayment = async (sessionId, orderId) => {
    try {
      const verifyResponse = await axios.get(`http://127.0.0.1:8080/api/payment/stripe/verify/${sessionId}`);
      
      if (verifyResponse.data.verified && verifyResponse.data.payment_status === 'paid') {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate(`/checkout/success?orderId=${orderId}&session_id=${sessionId}`);
        }, 2000);
      } else {
        setError('Le paiement n\'a pas encore été confirmé');
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Stripe verification error:', error);
      setError('Erreur lors de la vérification du paiement');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const processCardPayment = async (orderId, orderData) => {
    try {
      // For now, we'll create a payment with saved card
      // In production, you would integrate with Stripe or another payment processor
      const paymentResponse = await axios.post(`http://127.0.0.1:8080/api/payment/order/${orderId}`, {
        method: 'card',
        id_transaction: `TXN-${Date.now()}`
      });

      if (paymentResponse.data.payment) {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate(`/checkout/success?orderId=${orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Card payment error:', error);
      setError(error.response?.data?.message || 'Erreur lors du traitement du paiement');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !paymentStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Traitement du paiement</h2>
          <p className="text-gray-600">Veuillez patienter...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi !</h2>
          <p className="text-gray-600 mb-6">Votre commande a été confirmée.</p>
          <div className="animate-spin">
            <Loader2 className="w-8 h-8 text-indigo-600 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed' || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Échec du paiement</h2>
          <p className="text-gray-600 mb-6">{error || 'Une erreur est survenue lors du traitement du paiement.'}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/checkout')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentPage;
