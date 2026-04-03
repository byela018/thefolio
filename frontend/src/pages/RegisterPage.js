import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import signupImg from "../assets/signup.jpg";
import { DarkMode } from "../components/DarkMode";
import axios from '../api/axios';
import Modal from '../components/Modal';

const RegisterPage = () => {
  useEffect(() => {
    DarkMode();
  }, []);

    const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    dob: "",
    level: "",
    terms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
    dob: "",
    level: "",
    terms: "",
  });

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    if (type === "checkbox") {
      setFormValues({ ...formValues, [id]: checked });
    } else if (type === "radio") {
      setFormValues({ ...formValues, [name]: value });
    } else {
      setFormValues({ ...formValues, [id]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmpassword: "",
      dob: "",
      level: "",
      terms: "",
    };
    let isValid = true;

    if (!formValues.name.trim()) {
      newErrors.name = "Full Name is required";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formValues.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formValues.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formValues.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formValues.confirmpassword) {
      newErrors.confirmpassword = "Please confirm your password";
      isValid = false;
    } else if (formValues.password !== formValues.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
      isValid = false;
    }

    if (!formValues.dob) {
      newErrors.dob = "Date of Birth is required";
      isValid = false;
    } else {
      const birthDate = new Date(formValues.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;
      if (age < 18) {
        newErrors.dob = `You must be at least 18 years old (Current age: ${age})`;
        isValid = false;
      }
    }

    if (!formValues.level) {
      newErrors.level = "Please select an interest level";
      isValid = false;
    }

    if (!formValues.terms) {
      newErrors.terms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('/auth/register', {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
        });
        setModal({ show: true, message: 'Registration successful!', type: 'success' });
        setFormValues({
          name: "",
          email: "",
          username: "",
          password: "",
          confirmpassword: "",
          dob: "",
          level: "",
          terms: false,
        });
        setErrors({
          name: "",
          email: "",
          username: "",
          password: "",
          confirmpassword: "",
          dob: "",
          level: "",
          terms: "",
        });
      } catch (error) {
        setModal({ show: true, message: error.response?.data?.message || 'Failed!', type: 'error' });
      }
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
        <h2>Sign Up for Updates</h2>
        <p>Register to receive updates about my hobby and interests.</p>
      </section>

      <div className="line"></div>

      <div id="register-container">
        <div id="section-register1">
          <h3>Why Sign Up?</h3>
          <p>By signing up, <br />you will receive updates about my edits.</p>
        </div>
        <div id="section-register2">
          <img src={signupImg} alt="Decorative img related to hobbies" className="decorative-img" />
        </div>
      </div>

      <div className="line"></div>

      <section id="section-register3">
        <h3>Registration Form</h3>
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-main-content">
            <div className="left-column">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={formValues.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}

              <label htmlFor="username">Preferred Username:</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your preferred username"
                value={formValues.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error-msg">{errors.username}</span>}

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}

              <label htmlFor="confirmpassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmpassword"
                placeholder="Confirm your password"
                value={formValues.confirmpassword}
                onChange={handleChange}
              />
              {errors.confirmpassword && <span className="error-msg">{errors.confirmpassword}</span>}

              <label htmlFor="dob">Date of Birth:</label>
              <input
                type="date"
                id="dob"
                value={formValues.dob}
                onChange={handleChange}
              />
              {errors.dob && <span className="error-msg">{errors.dob}</span>}
            </div>

            <div className="right-column">
              <div className="radio-group">
                <label><strong>Interest Level:</strong></label>
                <label className="radio-item">
                  <input type="radio" name="level" value="Beginner" checked={formValues.level === "Beginner"} onChange={handleChange} /> Beginner
                </label>
                <label className="radio-item">
                  <input type="radio" name="level" value="Intermediate" checked={formValues.level === "Intermediate"} onChange={handleChange} /> Intermediate
                </label>
                <label className="radio-item">
                  <input type="radio" name="level" value="Expert" checked={formValues.level === "Expert"} onChange={handleChange} /> Expert
                </label>
                {errors.level && <span className="error-msg">{errors.level}</span>}
              </div>

              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" id="terms" checked={formValues.terms} onChange={handleChange} /> I agree to terms & conditions
                </label>
                {errors.terms && <span className="error-msg">{errors.terms}</span>}
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="submit-btn">Submit</button>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default RegisterPage;