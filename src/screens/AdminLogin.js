import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../screens/authForm.css';
import './burgerBg.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <div className="auth-form-bg">
          <div className="auth-form-container" style={{maxWidth: 400}}>
            <h2 className="text-success mb-4">Admin Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-success w-100" type="submit">Login</button>
            </form>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
