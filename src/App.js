import './App.css';
import './modern-ui.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Login from './screens/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import Signup from './screens/Signup';
import { CartProvider } from './components/contextReducer';
import { ToastProvider } from './components/ToastProvider';
import Payment from './screens/Payment';
import MyOrders from './screens/MyOrders';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import MyAccount from './screens/MyAccount';
import AdminLogin from './screens/AdminLogin';
import AdminPanel from './screens/AdminPanel';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/myorders' element={<MyOrders />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
              <Route path='/myaccount' element={<MyAccount />} />
              <Route path='/admin-login' element={<AdminLogin />} />
              <Route path='/admin' element={<AdminPanel />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;

