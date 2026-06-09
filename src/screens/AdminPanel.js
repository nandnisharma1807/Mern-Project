import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../screens/authForm.css';
import './burgerBg.css';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', img: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check admin auth
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin-login');
    fetchOrders(token);
    fetchItems(token);
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/order/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {}
  };

  const fetchItems = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/order/menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {}
  };

  const handleRemoveOrder = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`http://localhost:5000/api/admin/order/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(orders.filter(o => o._id !== id));
    } catch {}
  };

  const handleRemoveItem = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`http://localhost:5000/api/admin/item/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(items.filter(i => i._id !== id));
    } catch {}
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('http://localhost:5000/api/admin/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newItem)
      });
      const data = await res.json();
      if (data.success) {
        setItems([...items, data.item]);
        setNewItem({ name: '', price: '', category: '', img: '' });
        setMessage('Item added!');
      } else {
        setError(data.message || 'Failed to add item');
      }
    } catch {
      setError('Failed to add item');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <div className="auth-form-bg">
          <div className="auth-form-container" style={{maxWidth: 900, width: '100%'}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-success mb-0">Admin Panel</h2>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
            <h4>Orders</h4>
            <div style={{maxHeight: 250, overflowY: 'auto'}}>
              {orders.length === 0 && <div className="alert alert-info">No orders found.</div>}
              {orders.map(order => (
                <div key={order._id} className="border rounded p-2 mb-2 d-flex flex-column flex-md-row justify-content-between align-items-md-center" style={{background: 'rgba(255,255,255,0.7)'}}>
                  <div>
                    <strong>Order #{order._id}</strong>
                    {order.user?.email && <span className="ms-2">| <span className="text-success">{order.user.email}</span></span>}
                    {order.cart && <>
                      <br /><span style={{fontSize: '0.95em'}}>Items: {order.cart.map(i => i.name).join(', ')}</span>
                    </>}
                  </div>
                  <button className="btn btn-sm btn-danger mt-2 mt-md-0" onClick={() => handleRemoveOrder(order._id)}>Remove</button>
                </div>
              ))}
            </div>
            <h4 className="mt-4">Menu Items</h4>
            <div style={{maxHeight: 250, overflowY: 'auto'}}>
              {items.length === 0 && <div className="alert alert-info">No menu items found.</div>}
              {items.map(item => (
                <div key={item._id} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center" style={{background: 'rgba(255,255,255,0.7)'}}>
                  <span><strong>{item.name}</strong> (₹{item.price}) [{item.category}]</span>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveItem(item._id)}>Remove</button>
                </div>
              ))}
            </div>
            <h4 className="mt-4">Add Item</h4>
            <form onSubmit={handleAddItem} className="mb-3">
              <div className="row g-2 align-items-end">
                <div className="col-md-3 col-12 mb-2 mb-md-0">
                  <input type="text" className="form-control" placeholder="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                </div>
                <div className="col-md-2 col-6 mb-2 mb-md-0">
                  <input type="number" className="form-control" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
                </div>
                <div className="col-md-3 col-6 mb-2 mb-md-0">
                  <input type="text" className="form-control" placeholder="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} required />
                </div>
                <div className="col-md-3 col-12 mb-2 mb-md-0">
                  <input type="text" className="form-control" placeholder="Image URL" value={newItem.img} onChange={e => setNewItem({...newItem, img: e.target.value})} />
                </div>
                <div className="col-md-1 col-12">
                  <button className="btn btn-success w-100" type="submit">Add</button>
                </div>
              </div>
            </form>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
            {message && <div className="alert alert-success mt-2">{message}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
