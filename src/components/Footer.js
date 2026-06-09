import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div>
    <footer className="bg-dark text-light d-flex justify-content-between align-items-center p-3 mt-4">
      
      <div>
        <Link to="/Footer" className="text-light text-decoration-none">
          
            </Link>
        <span className="text-muted">© 2026 YumYardFoods ,Inc</span>
      </div>
    </footer>
    </div>
  );
}