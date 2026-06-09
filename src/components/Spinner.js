import React from 'react';
import './Spinner.css';

export default function Spinner({ show }) {
  if (!show) return null;
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
}
