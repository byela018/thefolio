import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../App.css";
import { DarkMode } from "../components/DarkMode";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';


const ProfilePage = () => {
  useEffect(() => {
    DarkMode();
  }, []);
  const [modal, setModal] = useState({ show: false, message: '', type: '' });
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');


  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      if (pic) fd.append('profilePic', pic);
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setModal({ show: true, message: 'Profile updated successfully! ✅', type: 'success' });
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    }
};

  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setModal({ show: true, message: 'Password changed successfully! ✅', type: 'success' });
      setCurPw(''); setNewPw('');
    } catch (err) {
      setModal({ show: true, message: err.response?.data?.message || 'Failed to change password', type: 'error' });
    }
};

  const picSrc = user?.profilePic
    ? `${user.profilePic}`
    : null;

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
        <h2>My Profile</h2>
        <p>Manage your account details.</p>
      </section>

      <div className="line"></div>

      <section id="profile-container">
        {/* PROFILE PIC */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
  {picSrc ? (
    <img
      src={picSrc}
      alt="Profile"
      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #CD2C58' }}
    />
  ) : (
    <div style={{
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#E06B80',
      border: '2px solid #CD2C58',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      fontSize: '40px',
      color: '#ffffff',
      fontWeight: 'bold'
    }}>
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  )}
</div>

        {/* ACCOUNT INFO */}
        <div id="profile-info">
          <h3>Account Info</h3>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          {user?.bio && <p><strong>Bio:</strong> {user?.bio}</p>}
        </div>

        <div className="line"></div>

        {/* EDIT PROFILE */}
        <div id="profile-password">
          <h3>Edit Profile</h3>
          <form onSubmit={handleProfile}>
            <label>Display Name:</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label>Bio:</label>
            <textarea
              rows="3"
              placeholder="Short bio..."
              value={bio}
              onChange={e => setBio(e.target.value)}
            ></textarea>

            <label>Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPic(e.target.files[0])}
            />

            <div className="form-footer">
              <button type="submit" className="submit-btn">Save Profile</button>
            </div>
          </form>
        </div>

        <div className="line"></div>

        {/* CHANGE PASSWORD */}
        <div id="profile-password">
          <h3>Change Password</h3>
          <form onSubmit={handlePassword}>
            <label>Current Password:</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={curPw}
              onChange={e => setCurPw(e.target.value)}
              required
            />

            <label>New Password:</label>
            <input
              type="password"
              placeholder="Enter new password (min 6 chars)"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              required
              minLength={6}
            />

            <div className="form-footer">
              <button type="submit" className="submit-btn">Change Password</button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProfilePage;