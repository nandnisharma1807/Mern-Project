import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import './authForm.css';
import './burgerBg.css';

export default function Signup() {
 const [credentials, setCredentials] = useState({name:'', email:'', password:'', geolocation:'', confirmPassword:''})

 const onChange = (e) => {
   setCredentials({...credentials, [e.target.name]: e.target.value})
 }

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (credentials.password !== credentials.confirmPassword) {
     alert('Passwords do not match')
     return;
   }

   try {
     const response = await fetch('http://localhost:5000/api/createuser', {
       method: 'POST',
       mode: 'cors',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         name: credentials.name,
         email: credentials.email,
         password: credentials.password,
         location: credentials.geolocation
       })
     });

     if (!response.ok) {
       const errBody = await response.text();
       throw new Error(`Server replied ${response.status}: ${errBody}`);
     }

     const json = await response.json();
     console.log('Sign-up response:', json);

     if (!json.success) {
       alert(json.message || 'Enter valid credentials');
     } else {
       alert('Registration successful');
       setCredentials({name:'', email:'', password:'', geolocation:'', confirmPassword:''});
      navigate('/login');
     }
   } catch (error) {
     console.error('Signup failed:', error);
     alert('Failed to connect to server; ensure backend is running at http://localhost:5000');
   }
 }
 const navigate = require('react-router-dom').useNavigate();

 return (
   <>
   <div className="burger-bg" />
   <div className="burger-bg-wrapper">
     <div className="auth-form-bg">
       <div className="auth-form-container">
         <div className="auth-form-title">Sign Up</div>
         <form onSubmit={handleSubmit}>
           <div className="mb-3">
             <label htmlFor="name" className="auth-form-label">Your Name</label>
             <input type="text" className="form-control auth-form-input" id="name" name="name" value={credentials.name} onChange={onChange} placeholder="Enter your name" required/>
           </div>
           <div className="mb-3">
             <label htmlFor="email" className="auth-form-label">Your Email</label>
             <input type="email" className="form-control auth-form-input" id="email" name="email" value={credentials.email} onChange={onChange} placeholder="Enter your email" required/>
           </div>
           <div className="mb-3">
             <label htmlFor="password" className="auth-form-label">Password</label>
             <input type="password" className="form-control auth-form-input" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Enter your password" required/>
           </div>
           <div className="mb-3">
             <label htmlFor="confirmPassword" className="auth-form-label">Repeat your password</label>
             <input type="password" className="form-control auth-form-input" id="confirmPassword" name="confirmPassword" value={credentials.confirmPassword} onChange={onChange} placeholder="Repeat your password" required/>
           </div>
           <div className="mb-3">
             <label htmlFor="geolocation" className="auth-form-label">Your Location</label>
             <input type="text" className="form-control auth-form-input" id="geolocation" name="geolocation" value={credentials.geolocation} onChange={onChange} placeholder="Enter your location" required/>
           </div>
           <button type="submit" className="btn btn-success auth-form-btn">Register</button>
           <Link to="/login" className="auth-form-link">Already have an account? Login</Link>
         </form>
       </div>
     </div>
   </div>
   </>
   )
}

