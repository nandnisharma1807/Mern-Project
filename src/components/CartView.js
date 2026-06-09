import React from 'react';
import { useCart, useDispatchCart } from './contextReducer';
import { useNavigate } from 'react-router-dom';
import './CartView.css';

export default function CartView() {
  const cart = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return <div className="p-3 cartview-container cartview-empty">Your cart is empty.</div>;
  }

  const handleCheckout = () => {
    navigate('/payment');
  };

  return (
    <div className="p-3 cartview-container">
      <div className="cartview-title">Your Cart</div>
      <table className="table table-bordered table-hover cartview-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={idx}>
              <td>
                <img src={item.img || 'https://via.placeholder.com/60x40?text=No+Image'} alt={item.name} />
              </td>
              <td>{item.name}</td>
              <td>
                <select
                  value={item.size}
                  onChange={e => dispatch({ type: 'UPDATE', index: idx, size: e.target.value })}
                  className="form-select form-select-sm"
                  style={{ width: 80 }}
                >
                  {item.name.toLowerCase().includes('pizza') ? (
                    <>
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                    </>
                  ) : (
                    <>
                      <option value="Half">Half</option>
                      <option value="Full">Full</option>
                    </>
                  )}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => dispatch({ type: 'UPDATE', index: idx, quantity: Number(e.target.value) })}
                  className="form-control form-control-sm"
                  style={{ width: 60 }}
                />
              </td>
              <td>₹ {item.price}</td>
              <td>₹ {item.price * item.quantity}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => dispatch({ type: 'REMOVE', index: idx })}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cartview-total">
        Grand Total: ₹ {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
      </div>
      <button className="cartview-checkout-btn" onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
