import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reset-password/${token}` , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Password reset successful. Please login.', 'success');
        navigate('/login');
      } else {
        showToast(data.message || 'Failed to reset password.', 'error');
      }
    } catch (err) {
      showToast('Network error. Try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-form-bg">
      <div className="auth-form-container">
        <div className="auth-form-title">Reset Password</div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="auth-form-label">New Password</label>
            <input type="password" className="form-control auth-form-input" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter new password" required />
          </div>
          <button type="submit" className="btn btn-success auth-form-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
