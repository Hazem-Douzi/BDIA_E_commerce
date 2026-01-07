import React, { useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Login = () => {;
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post('http://127.0.0.1:8080/api/auth/login', {
        email,
        password,
        
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        const { token, userId, username, role } = response.data;
        
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({
      id: userId,
      username,
      role
    }));

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
if (role === 'admin') {
    window.location.href = 'http://localhost:5173/Home_admin';
  } else if (role === 'seller') {
    window.location.href = 'http://localhost:5173/Home_seller';
  } else if (role === 'client') {
    window.location.href = 'http://localhost:5173/Home_client';
  } 
      }
    } catch (error) {
      console.error('Login error:', error);
      const status = error?.response?.status;
      let message = error?.response?.data?.message || 'Login failed';
      if (status === 401) {
        message = 'Email or password is incorrect';
      } else if (status === 404) {
        message = 'Account does not exist';
      }
      setErrors({ general: message });
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            {/* <Link to="/" className="auth-logo">ShopEase</Link> */}
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="https://accounts.google.com/v3/signin/challenge/pwd?TL=ALgCv6ztUnILtAQxogrpDtaizoFW5h5q3vBt78aMgzuK10nTFST0PuZFxAlYCgPI&authuser=0&cid=2&continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Fpassword&flowName=GlifWebSignIn&hl=fr&ifkv=AdBytiMmyIb_crFjDi_kuNBEX3VNI5DKsLYsqP0XraDGlpeMGlEeRVuKWxbDN_X6cbMHkLMHihGs&kdi=CAM&rart=ANgoxceF8HHKcPmYdIzXyPuuYHQh9Vo_6noGx4zutOi6gTF8P5Ca2KjDGAbRrcdQx9kq4KyxhrWezKSd_mJrmXe5V1SICwJS3kk97xYM8L7AQeAPVmyA_Cc&rpbg=1&sarp=1&scc=1&service=accountsettings" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-button google">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button className="social-button facebook">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? 
              <Link to="/register" className="auth-link"> Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
