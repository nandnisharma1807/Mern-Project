import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import './authForm.css';
import './burgerBg.css';
export default function Login(){
    const [credentials, setCredentials] = useState({ email:'', password:''})
     
    let navigate = useNavigate();
     const onChange = (e) => {
       setCredentials({...credentials, [e.target.name]: e.target.value})
     }
    
     const handleSubmit = async (e) => {
       e.preventDefault();
    
       try {
         const response = await fetch('http://localhost:5000/api/login', {
           method: 'POST',
           mode: 'cors',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({
             email: credentials.email,
             password: credentials.password
           })
         });
    
         if (!response.ok) {
           const json = await response.json().catch(() => null);
           throw new Error(json?.message || `Server replied ${response.status}`);
         }
    
         const json = await response.json();
        console.log('Login response:', json);

        if (!json.success) {
           alert(json.message || 'Invalid credentials');
         } else {
            localStorage.setItem('authToken', json.token);
            if (json.user && json.user.email) {
              localStorage.setItem('userEmail', json.user.email);
            } else if (credentials.email) {
              localStorage.setItem('userEmail', credentials.email);
            }
            console.log(localStorage.getItem('authToken')); // Debug: Check if token is stored
          navigate("/"); // Redirect to home after login
         }
       } catch (error) {
         console.error('Login failed:', error);
         alert(error.message || 'Failed to connect to server; ensure backend is running at http://localhost:5000');
       }
     }
    
    return (
      <>
        <div className="burger-bg" />
        <div className="burger-bg-wrapper">
          <div className="auth-form-bg">
            <div className="auth-form-container">
              <div className="auth-form-title">Login</div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="auth-form-label">Your Email</label>
                  <input type="email" className="form-control auth-form-input" id="email" name="email" value={credentials.email} onChange={onChange} placeholder="Enter your email" required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="auth-form-label">Password</label>
                  <input type="password" className="form-control auth-form-input" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Enter your password" required/>
                </div>
                <button type="submit" className="btn btn-success auth-form-btn">Login</button>
                <div className="d-flex flex-column align-items-start mt-2">
                  <Link to="/signup" className="auth-form-link">I am a new user</Link>
                  <Link to="/forgot-password" className="auth-form-link mt-1">Forgot Password?</Link>
                  <Link to="/admin-login" className="auth-form-link mt-1 text-danger fw-bold">Admin Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    )
}
