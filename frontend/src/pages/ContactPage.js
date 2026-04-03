// src/components/Contact.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import Modal from '../components/Modal';
import API from '../api/axios';

const ContactPage = () => {

  useEffect(() => {
  const cleanup = DarkMode(); 
  return () => {
    if (typeof cleanup === 'function') cleanup();
  };
}, []);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formValues.name.trim()) {
      newErrors.name = "Please enter your name";
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

    if (!formValues.message.trim()) {
      newErrors.message = "Message cannot be empty";
      isValid = false;
    } else if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm()) {
        try {
          await API.post('/messages', {
            name: formValues.name,
            email: formValues.email,
            message: formValues.message,
          });
          setModal({ show: true, message: 'Message sent successfully! I will get back to you soon! 😊', type: 'success' });
          setFormValues({ name: "", email: "", message: "" });
          setErrors({ name: "", email: "", message: "" });
        } catch (error) {
          setModal({ show: true, message: 'Failed to send message. Please try again!', type: 'error' });
        }
      }
  };

  return (
    <>
      <Header />
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '', type: '' })}
        />
      )}
      {/* Dark Mode button */}
      <button id="modeToggle">🌙</button>

      {/* HERO */}
      <section id="hero-contact">
        <h2>Contact Me & Useful Resources</h2>
        <p>You may send me a message or explore helpful resources below.</p>
      </section>

      <div className="line"></div>

      {/* CONTACT FORM */}
      <section className="contact-section">
        <h3>Contact Form</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            value={formValues.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}

          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            placeholder="example@email.com"
            value={formValues.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}

          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            rows="5"
            placeholder="Type your message here"
            value={formValues.message}
            onChange={handleChange}
          ></textarea>
          {errors.message && <span className="error-msg">{errors.message}</span>}

          <button type="submit" className="main-btn">Submit Message</button>
        </form>
      </section>

      {/* HELPFUL RESOURCES */}
      <section className="resources-section">
        <h3>Helpful Resources</h3>
        <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>W3Schools</td>
              <td>Website for learning HTML, CSS, and web basics.</td>
            </tr>
            <tr>
              <td>CapCut</td>
              <td>Video editing tool used for creating simple and creative edits.</td>
            </tr>
            <tr>
              <td>Alight Motion</td>
              <td>Mobile app for motion graphics and video editing.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* LOCATION */}
      <section className="location-section">
        <h3>Location</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24377.5!2d-68.5364!3d-31.5375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1700000000000"
          allowFullScreen=""
          loading="lazy"
          title="Location Map"
        ></iframe>
      </section>

      <div className="line"></div>

      {/* EXTERNAL LINKS */}
      <section className="external-links-section">
        <h3>External Links</h3>
        <ul>
          <li><a href="https://www.w3schools.com" target="_blank" rel="noreferrer">W3Schools – Learn Web Development</a></li>
          <li><a href="https://www.capcut.com" target="_blank" rel="noreferrer">CapCut Official Website</a></li>
          <li><a href="https://alightmotion.com" target="_blank" rel="noreferrer">Alight Motion Official Website</a></li>
        </ul>
      </section>

      <Footer />
    </>
  );
};

export default ContactPage;
