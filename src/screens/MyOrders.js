import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/OrderCard.css';
import Spinner from '../components/Spinner';
import './authForm.css';
import './burgerBg.css';

// Helper to format remaining time as mm:ss
function formatTime(ms) {
  if (ms <= 0) return 'Arrived';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Delivery time in minutes
const DELIVERY_MINUTES = 30;

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Timer for live countdown (MOVED UP — hooks must be at top)
  const [now, setNow] = useState(Date.now());

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/orders?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
        else setError(data.message || 'Failed to fetch orders');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch orders');
        setLoading(false);
      });
  }, [userEmail]);

  if (!userEmail) {
    return (
      <div className="container my-5">
        <h2 className="text-success mb-4">My Orders</h2>
        <div className="alert alert-warning">Please log in to view your orders.</div>
      </div>
    );
  }

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <div className="auth-form-bg">
          <div className="auth-form-container" style={{ maxWidth: 700 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-success mb-0">My Orders</h2>
              <button className="btn btn-success" onClick={() => navigate('/')}>Back to Home</button>
            </div>

            <Spinner show={loading} />

            {!loading && error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {!loading && !error && orders.length === 0 && (
              <div className="alert alert-info">No orders found.</div>
            )}

            {!loading && !error && orders.length > 0 &&
              orders.map(order => {
                const created = order.createdAt
                  ? new Date(order.createdAt)
                  : order.date
                  ? new Date(order.date)
                  : null;

                let eta = null;
                if (created) {
                  const deliveryTime = new Date(created.getTime() + DELIVERY_MINUTES * 60000);
                  const msLeft = deliveryTime - now;
                  eta = formatTime(msLeft);
                }

                return (
                  <div key={order._id || order.id} className="mb-4 p-3 border rounded order-card">
                    <div className="fw-bold mb-2">Order #{order._id || order.id}</div>

                    <div className="mb-2 text-muted">
                      Placed: {created ? created.toLocaleString() : ''}
                    </div>

                    <div className="mb-2">
                      Payment Method:
                      <span className="text-success">
                        {order.paymentMethod === 'debit'
                          ? ' Debit Card'
                          : order.paymentMethod === 'credit'
                          ? ' Credit Card'
                          : ' Cash on Delivery'}
                      </span>
                    </div>

                    <div className="mb-2">
                      <span className="text-primary">Delivery Location: </span>
                      {typeof order.location === 'string' &&
                      order.location !== '' &&
                      order.location !== 'Unknown' &&
                      order.location !== 'Denied' ? (
                        order.location
                      ) : order.location &&
                        typeof order.location === 'object' &&
                        order.location.lat &&
                        order.location.lng ? (
                        `Lat: ${order.location.lat.toFixed(5)}, Lng: ${order.location.lng.toFixed(5)}`
                      ) : (
                        <span className="text-muted">Not available</span>
                      )}
                    </div>

                    <div className="mb-2">
                      <span className="text-info">Estimated Delivery: </span>
                      {eta ? (
                        eta === 'Arrived' ? (
                          <span className="text-success">Arrived</span>
                        ) : (
                          <span>{eta}</span>
                        )
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </div>

                    <table className="table table-bordered table-sm">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Size</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cart.map((item, i) => (
                          <tr key={i}>
                            <td>
                              <img
                                src={item.img || 'https://via.placeholder.com/60x40?text=No+Image'}
                                alt={item.name}
                                style={{ width: 60, height: 40, objectFit: 'cover' }}
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.size}</td>
                            <td>{item.quantity}</td>
                            <td>₹ {item.price}</td>
                            <td>₹ {item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="fw-bold text-end">
                      Grand Total: ₹{' '}
                      {order.cart.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}