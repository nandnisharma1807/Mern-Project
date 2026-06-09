import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './authForm.css';
import './burgerBg.css';

export default function MyAccount() {
  const [profile, setProfile] = useState({ name: '', email: '', location: '' });
  const [editMode, setEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newName, setNewName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) return;
    fetch(`http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setProfile(data.user);
          setNewEmail(data.user.email);
          setNewLocation(data.user.location);
          setNewName(data.user.name);
        }
      });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const email = profile.email;
      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: newName,
          location: newLocation,
          newEmail,
          newPassword: newPassword ? newPassword : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setEditMode(false);
        setMessage('Profile updated successfully!');
        if (newEmail) localStorage.setItem('userEmail', newEmail);
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setMessage('Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="burger-bg" />
      <div className="burger-bg-wrapper">
        <div className="auth-form-bg">
          <div className="auth-form-container" style={{maxWidth: 500}}>
            <h2 className="text-success mb-4">My Account</h2>
            {!editMode ? (
              <div className="card p-3 mb-3 border-0" style={{boxShadow: 'none', background: 'transparent'}}>
                <div className="mb-2"><strong>Name:</strong> {profile.name}</div>
                <div className="mb-2"><strong>Email:</strong> {profile.email}</div>
                <div className="mb-2"><strong>Location:</strong> {profile.location}</div>
                <button className="btn btn-success mt-2" onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="card p-3 mb-3 border-0" style={{boxShadow: 'none', background: 'transparent'}}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" value={newLocation} onChange={e => setNewLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                </div>
                <button className="btn btn-success w-100" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                <button type="button" className="btn btn-link mt-2" onClick={() => setEditMode(false)}>Cancel</button>
              </form>
            )}
            {message && <div className="alert alert-info mt-3">{message}</div>}
            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
