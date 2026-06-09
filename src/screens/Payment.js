import React, { useState, useEffect } from 'react';
import { useCart } from '../components/contextReducer';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './authForm.css';
import './burgerBg.css';

export const stripePromise = loadStripe('pk_test_51TJigQCql3pWiLZe5XDOcKOkTSVpcNuz2pWkAYBvY2MFcOKxh3k1C4gABzrAcnwisk2rSNvFJn4CCBztw2Jl6fL600POZwA2nr');
function StripeCardForm({ placing, cart, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Calculate total in paise (INR)
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0) * 100;

  // Validation helpers
  const isCartEmpty = !cart || cart.length === 0;
  const isAmountValid = typeof totalAmount === 'number' && !isNaN(totalAmount) && totalAmount > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate cart and amount
    if (isCartEmpty) {
      setError('Your cart is empty. Please add items before paying.');
      return;
    }
    if (!isAmountValid) {
      setError('Order amount is invalid. Please review your cart.');
      return;
    }

    // Debug log
    console.log('Submitting payment with amount:', totalAmount, 'cart:', cart);

    setProcessing(true);
    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to create payment intent. Please check your cart and try again.');
        setProcessing(false);
        return;
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to create payment intent');
      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setProcessing(false);
        onSuccess(result.paymentIntent.id);
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-3">
        <CardElement options={{hidePostalCode: true}} />
      </div>
      {error && <div className="alert alert-danger py-1">{error}</div>}
      <button
        className="btn btn-success"
        type="submit"
        disabled={placing || !stripe || processing || isCartEmpty || !isAmountValid}
        title={isCartEmpty ? 'Cart is empty' : !isAmountValid ? 'Invalid amount' : ''}
      >
        {processing ? 'Processing...' : 'Pay with Card'}
      </button>
    </form>
  );
}


export default function Payment() {
  const cart = useCart();
  const dispatch = require('../components/contextReducer').useDispatchCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('debit');
  const [placing, setPlacing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  // Get live location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setLocation(coords);
          setAddress(`${coords.lat}, ${coords.lng}`);
        },
        (err) => {
          setLocation(null);
          setAddress('');
        }
      );
    }
  }, []);
  // Called after successful Stripe payment
  const handleStripeSuccess = async (paymentId) => {
    setPlacing(true);
    try {
      const user = { email: localStorage.getItem('userEmail') || 'guest@example.com' };
      const res = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, cart, paymentId, paymentMethod, location: address })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Order save failed');
      dispatch({ type: 'CLEAR' });
      setSuccessMsg('Order placed successfully! Redirecting to My Orders...');
      setPlacing(false);
      setTimeout(() => {
        navigate('/myorders');
      }, 1500);
    } catch (err) {
      alert('Order save failed: ' + err.message);
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    try {
      const user = { email: localStorage.getItem('userEmail') || 'guest@example.com' };
      fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, cart, paymentMethod: 'cod', location: address })
      })
        .then(res => res.json())
        .then(data => {
          setPlacing(false);
          if (!data.success) throw new Error(data.message || 'Order save failed');
          dispatch({ type: 'CLEAR' });
          navigate('/myorders'); // Redirect to My Orders after COD
        })
        .catch(err => {
          alert('Order save failed: ' + err.message);
          setPlacing(false);
        });
    } catch (err) {
      alert('Order save failed: ' + err.message);
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <div className="auth-form-bg">
          <div className="auth-form-container" style={{maxWidth: 500}}>
            <h2 className="text-success mb-4">Payment</h2>
            <div className="alert alert-info" style={{fontSize: '0.95rem'}}>
              <strong>Test Card for Stripe Payments:</strong><br />
              Card: <b>4242 4242 4242 4242</b><br />
              Expiry: <b>Any future date</b> &nbsp; CVC: <b>Any 3 digits</b> &nbsp; ZIP: <b>Any 5 digits</b><br />
              <span style={{fontSize: '0.9rem'}}>See more test cards at <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener noreferrer">stripe.com/docs/testing</a></span>
            </div>
            <div className="mb-3">Choose Payment Method:</div>
            <div className="mb-2">
              <strong>Location:</strong> {address || 'Not available'}
            </div>
            <div className="mb-4">
              <label className="me-3">
                <input type="radio" value="debit" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} /> Debit Card
              </label>
              <label className="me-3">
                <input type="radio" value="credit" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} /> Credit Card
              </label>
              <label>
                <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery
              </label>
            </div>
            {/* Show Stripe CardElement only for debit or credit */}
            {(paymentMethod === 'debit' || paymentMethod === 'credit') ? (
              <Elements stripe={stripePromise}>
                <StripeCardForm placing={placing} cart={cart} onSuccess={handleStripeSuccess} />
              </Elements>
            ) : (
              <div className="alert alert-warning">Select Debit or Credit Card to pay online.</div>
            )}
            {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}
            {/* Show Place Order button only for COD */}
            {paymentMethod === 'cod' && (
              <button className="btn btn-success" onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
