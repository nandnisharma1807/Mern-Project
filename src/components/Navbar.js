import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import CartView from './CartView';

export default function Navbar() {
  const navigate = useNavigate();
  const [showCart, setShowCart] = React.useState(false);
  const dispatch = require('./contextReducer').useDispatchCart();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'CLEAR' });
    navigate('/'); // Redirect to home page after logout
  }
  const isLoggedIn = !!localStorage.getItem('authToken');
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link className="navbar-brand fs-1 fst-italic" to="/">YumYardFoods</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active fs-5" aria-current="page" to="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link active fs-5" aria-current="page" to="/myorders">My Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active fs-5" aria-current="page" to="/myaccount">My Account</Link>
                </li>
                {/* Admin Login link removed as requested */}
              </>
            )}
          </ul>
          {!isLoggedIn ? (
            <div className="d-flex">
              <Link className="btn bg-success text-white mx-1" to="/login">Login</Link>
              <Link className="btn bg-success text-white mx-1" to="/signup">Signup</Link>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <div className="btn bg-success text-white mx-1" onClick={() => setShowCart(!showCart)}>
                My cart
              </div>
              {showCart && (
                <div style={{ position: 'absolute', right: 0, top: '100%', zIndex: 9999, background: 'white', minWidth: 350, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                  <CartView />
                </div>
              )}
              <div className="btn bg-success text-white mx-1" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}