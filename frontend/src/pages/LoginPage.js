import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import API from '../api/axios';

const LoginPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirm, setForgotConfirm] = useState('');

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [modal, setModal] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = await login(formValues.email, formValues.password);
        setModal({ show: true, message: 'Login successful! Welcome back! 😊', type: 'success' });
        setTimeout(() => {
          navigate(user.role === 'admin' ? '/admin' : '/');
        }, 1500);
      } catch (error) {
        setModal({ show: true, message: error.response?.data?.message || 'Login failed!', type: 'error' });
      }
    }
  };

  const handleForgotPassword = async (e) => {
  e.preventDefault();
  if (forgotPassword !== forgotConfirm) {
    setModal({ show: true, message: 'Passwords do not match!', type: 'error' });
    return;
  }
  if (forgotPassword.length < 6) {
    setModal({ show: true, message: 'Password must be at least 6 characters!', type: 'error' });
    return;
  }
  try {
    await API.post('/auth/forgot-password', {
      email: forgotEmail,
      newPassword: forgotPassword,
    });
    setModal({ show: true, message: 'Password reset successfully! You can now login! ✅', type: 'success' });
    setShowForgot(false);
    setForgotEmail('');
    setForgotPassword('');
    setForgotConfirm('');
  } catch (err) {
    setModal({ show: true, message: err.response?.data?.message || 'Failed to reset password!', type: 'error' });
  }
};

  return (
    <>
      <Header />
      <button id="modeToggle">🌙</button>

      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '', type: '' })}
        />
      )}

      <section id="hero-register">
        <h2>Welcome Back!</h2>
        <p>Login to your account.</p>
      </section>

      <div className="line"></div>

      <section id="login-container">
        <h3>Login Form</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={formValues.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error-msg">{errors.password}</span>}

          <div className="form-footer">
            <button type="submit" className="submit-btn">Login</button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            <span
              className="post-author-link"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </span>
          </p>
        </form>
      </section>
      {showForgot && (
        <div className="modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title success">Reset Password</h3>
            <form onSubmit={handleForgotPassword}>
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #000' }}
              />
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold' }}>New Password:</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={forgotPassword}
                onChange={e => setForgotPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #000' }}
              />
              <label style={{ display: 'block', textAlign: 'left', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password:</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={forgotConfirm}
                onChange={e => setForgotConfirm(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #000' }}
              />
              <div className="logout-modal-btns">
                <button type="submit" className="submit-btn">Reset Password</button>
                <button type="button" className="edit-btn" onClick={() => setShowForgot(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default LoginPage;