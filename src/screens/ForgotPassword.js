import React, { useState } from 'react';
import { useToast } from '../components/ToastProvider';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Reset link sent to your email.', 'success');
      } else {
        showToast(data.message || 'Failed to send reset link.', 'error');
      }
    } catch (err) {
      showToast('Network error. Try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-form-bg">
      <div className="auth-form-container">
        <div className="auth-form-title">Forgot Password</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="auth-form-label">Your Email</label>
            <input type="email" className="form-control auth-form-input" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <button type="submit" className="btn btn-success auth-form-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
